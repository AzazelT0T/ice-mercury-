import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../DataContext';
import { ArrowLeft, Thermometer, Droplets, Zap, Activity, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const ContainerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { containers, settings, setContainerTargetTemp, triggerShock } = useData();
  const theme = settings.primaryColor;

  const container = containers.find(c => c.id === id);

  if (!container) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Container not found</div>;
  }

  // Formatting timestamp for Chart
  const chartData = container.history.map(h => ({
    ...h,
    time: new Date(h.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })
  }));

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContainerTargetTemp(container.id, parseFloat(e.target.value));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/containers" className="p-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            {container.name} 
            <span className="ml-3 text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
              {container.id}
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Status & Current Readings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-slate-700 dark:text-slate-300">Live Status</h3>
               <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase
                  ${container.status === 'Critical' ? 'bg-red-500 text-white animate-pulse' : 
                    container.status === 'At Risk' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-500 text-white'}
               `}>
                 {container.status}
               </span>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                 <Thermometer className={`mx-auto mb-2 ${container.currentReading.temperature > settings.tempMax ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
                 <div className="text-3xl font-bold text-slate-800 dark:text-white">{container.currentReading.temperature}°C</div>
                 <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Temperature</div>
               </div>
               <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                 <Droplets className="mx-auto mb-2 text-blue-400" />
                 <div className="text-3xl font-bold text-slate-800 dark:text-white">{container.currentReading.humidity}%</div>
                 <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Humidity</div>
               </div>
             </div>

             {container.isCoolingActive && (
               <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg flex items-center text-blue-700 dark:text-blue-300 text-sm">
                 <Zap size={18} className="mr-2 animate-bounce" />
                 <div>
                   <p className="font-bold">Corrective Action Active</p>
                   <p className="text-xs text-blue-600 dark:text-blue-400">Cooling system engaged to lower temp.</p>
                 </div>
               </div>
             )}
          </div>

          {/* Simulation Controls */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-purple-500 transition-colors">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
              <Activity size={18} className="mr-2 text-purple-500" />
              Simulation Controls
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Target Temperature Control
                </label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="-5" 
                    max="15" 
                    step="0.5" 
                    value={container.targetTemperature} 
                    onChange={handleTempChange}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="w-16 text-center font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
                    {container.targetTemperature}°C
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Drag slider to simulate ambient temperature changes. If value exceeds safe range ({settings.tempMin}-{settings.tempMax}°C) for {settings.consecutiveViolationsTrigger}s, alert triggers.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Event Triggers
                 </label>
                 <button 
                   onClick={() => triggerShock(container.id)}
                   className="w-full flex items-center justify-center space-x-2 py-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-lg transition-colors"
                 >
                   <AlertTriangle size={16} />
                   <span>Simulate Drop/Shock</span>
                 </button>
                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                   Triggering shock while temperature is "At Risk" creates an immediate Critical alert.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-6">Real-time Telemetry</h3>
          <div className="flex-1 min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={settings.darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="time" stroke={settings.darkMode ? '#94a3b8' : '#94a3b8'} fontSize={12} tick={{dy: 10}} />
                <YAxis stroke={settings.darkMode ? '#94a3b8' : '#94a3b8'} domain={['auto', 'auto']} fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: settings.darkMode ? '#1e293b' : '#fff', 
                    borderRadius: '8px', 
                    border: settings.darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                    color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                  }}
                  labelStyle={{ color: settings.darkMode ? '#94a3b8' : '#64748b' }}
                />
                <ReferenceLine y={settings.tempMax} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max Safe', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={settings.tempMin} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Min Safe', fill: '#3b82f6', fontSize: 10 }} />
                
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke={theme === 'cyan' ? '#0891b2' : theme === 'emerald' ? '#059669' : theme === 'violet' ? '#7c3aed' : '#475569'} 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                  isAnimationActive={false} // Disable animation for smoother realtime updates
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
             <div className="flex items-center"><div className={`w-3 h-1 bg-${theme}-600 mr-2`}></div>Temperature</div>
             <div className="flex items-center"><div className="w-3 h-1 border-t border-dashed border-red-500 mr-2"></div>Safe Limits</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContainerDetail;