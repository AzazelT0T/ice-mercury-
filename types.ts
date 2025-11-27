export enum ContainerStatus {
  STABLE = 'Stable',
  AT_RISK = 'At Risk',
  CRITICAL = 'Critical'
}

export enum AlertSeverity {
  WARNING = 'Warning',
  CRITICAL = 'Critical'
}

export interface SensorReading {
  timestamp: number;
  temperature: number;
  humidity: number;
  shockDetected: boolean;
}

export interface Alert {
  id: string;
  containerId: string;
  containerName: string;
  timestamp: number;
  message: string;
  severity: AlertSeverity;
  active: boolean;
  resolvedAt?: number;
}

export interface Container {
  id: string;
  name: string;
  batchNumber: string;
  drugName: string;
  imageUrl: string; // Placeholder URL
  currentReading: SensorReading;
  status: ContainerStatus;
  history: SensorReading[]; // Last N readings for chart
  
  // Simulation Control Params
  targetTemperature: number; // The temp the environment is trying to reach
  isCoolingActive: boolean; // Automatic corrective action
}

export interface AppSettings {
  tempMin: number;
  tempMax: number;
  humidityMax: number;
  consecutiveViolationsTrigger: number; // How many bad readings in a row
  primaryColor: string; // Tailwind color name
  darkMode: boolean;
}