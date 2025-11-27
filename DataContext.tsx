import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Container, Alert, AppSettings, SensorReading, ContainerStatus, AlertSeverity } from './types';
import { INITIAL_CONTAINERS, DEFAULT_SETTINGS } from './constants';

interface DataContextType {
  containers: Container[];
  alerts: Alert[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setContainerTargetTemp: (id: string, temp: number) => void;
  triggerShock: (id: string) => void;
  resetAlert: (alertId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [containers, setContainers] = useState<Container[]>(INITIAL_CONTAINERS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  // Refs to hold mutable state for the interval loop to avoid closure staleness
  const containersRef = useRef(containers);
  const settingsRef = useRef(settings);
  const violationCountersRef = useRef<Record<string, number>>({}); 

  useEffect(() => {
    containersRef.current = containers;
  }, [containers]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  /**
   * CORE SIMULATION LOOP & ALERT LOGIC
   * In a real app, this would be an MQTT subscription callback or WebSocket event handler.
   */
  const simulateTick = useCallback(() => {
    const now = Date.now();
    const currentSettings = settingsRef.current;

    setContainers(prevContainers => {
      return prevContainers.map(container => {
        // 1. Calculate new simulated physical values
        // If cooling is active (corrective action), pull temp down quickly.
        // Otherwise, drift towards the "Target Temperature" set by the user controls.
        let newTemp = container.currentReading.temperature;
        
        if (container.isCoolingActive) {
           // Cooling system is strong, drops temp fast
           newTemp = Math.max(currentSettings.tempMin + 1, newTemp - 0.5);
        } else {
           // Natural drift towards target (simulating environment change)
           const drift = (container.targetTemperature - newTemp) * 0.1;
           // Add some noise (+/- 0.1)
           const noise = (Math.random() - 0.5) * 0.2;
           newTemp = newTemp + drift + noise;
        }

        // Simulate humidity fluctuation
        let newHumidity = container.currentReading.humidity + (Math.random() - 0.5);
        newHumidity = Math.max(20, Math.min(90, newHumidity));

        // Create new reading object
        const newReading: SensorReading = {
          timestamp: now,
          temperature: parseFloat(newTemp.toFixed(2)),
          humidity: parseFloat(newHumidity.toFixed(2)),
          shockDetected: false // Shock is manual trigger only for this demo
        };

        // 2. Alert Logic Implementation
        // Twist: Only alert on consecutive violations
        const isTempViolation = newReading.temperature > currentSettings.tempMax || newReading.temperature < currentSettings.tempMin;
        
        // Update violation counter
        let currentViolations = violationCountersRef.current[container.id] || 0;
        
        if (isTempViolation) {
          currentViolations += 1;
        } else {
          currentViolations = 0; // Reset if reading is safe
        }
        violationCountersRef.current[container.id] = currentViolations;

        // Determine Status
        let newStatus = ContainerStatus.STABLE;
        let coolingNeeded = container.isCoolingActive;

        // TRIGGER CONDITION: Consecutive violations
        if (currentViolations >= currentSettings.consecutiveViolationsTrigger) {
           newStatus = ContainerStatus.CRITICAL;
           
           // Auto-trigger corrective action
           coolingNeeded = true; 
           
           // Generate Alert if not already critical/alerted recently
           // (Simple dedup logic: don't spam alerts every second if already Critical)
           if (container.status !== ContainerStatus.CRITICAL) {
             const newAlert: Alert = {
               id: `ALT-${now}`,
               containerId: container.id,
               containerName: container.name,
               timestamp: now,
               message: `CRITICAL: Temp deviation (${newReading.temperature}°C) sustained for ${currentViolations}s.`,
               severity: AlertSeverity.CRITICAL,
               active: true
             };
             setAlerts(prev => [newAlert, ...prev]);
           }
        } 
        else if (currentViolations > 0) {
           newStatus = ContainerStatus.AT_RISK; // Warning phase
        }

        // RESET CONDITION: If temp is back in safe range and stable
        if (coolingNeeded && !isTempViolation && currentViolations === 0) {
           // Turn off cooling once stable
           coolingNeeded = false;
           // Mark alerts as resolved
           setAlerts(prev => prev.map(a => 
             (a.containerId === container.id && a.active) 
             ? { ...a, active: false, resolvedAt: now } 
             : a
           ));
        }

        // Limit history to last 50 points
        const newHistory = [...container.history, newReading].slice(-50);

        return {
          ...container,
          currentReading: newReading,
          history: newHistory,
          status: newStatus,
          isCoolingActive: coolingNeeded
        };
      });
    });
  }, []);

  // Run simulation every 1 second
  useEffect(() => {
    const intervalId = setInterval(simulateTick, 1000);
    return () => clearInterval(intervalId);
  }, [simulateTick]);

  // --- Public Actions ---

  const setContainerTargetTemp = (id: string, temp: number) => {
    setContainers(prev => prev.map(c => 
      c.id === id ? { ...c, targetTemperature: temp } : c
    ));
  };

  const triggerShock = (id: string) => {
    // Immediate specific logic for Shock:
    // If shock happens while Temp is At Risk, escalate immediately.
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        // Create a shock reading
        const shockReading = { ...c.currentReading, shockDetected: true, timestamp: Date.now() };
        
        // Logic: Temp Violation + Shock = Instant Alert
        if (c.status === ContainerStatus.AT_RISK || c.status === ContainerStatus.CRITICAL) {
           const newAlert: Alert = {
             id: `ALT-SHOCK-${Date.now()}`,
             containerId: c.id,
             containerName: c.name,
             timestamp: Date.now(),
             message: `CRITICAL: Shock detected during temperature excursion!`,
             severity: AlertSeverity.CRITICAL,
             active: true
           };
           setAlerts(a => [newAlert, ...a]);
           return { ...c, currentReading: shockReading, status: ContainerStatus.CRITICAL, history: [...c.history, shockReading] };
        }
        
        // Just shock alone? Maybe just a warning log (implemented as simple history update here)
        return { ...c, currentReading: shockReading, history: [...c.history, shockReading] };
      }
      return c;
    }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: false, resolvedAt: Date.now() } : a));
  };

  return (
    <DataContext.Provider value={{ containers, alerts, settings, updateSettings, setContainerTargetTemp, triggerShock, resetAlert }}>
      {children}
    </DataContext.Provider>
  );
};