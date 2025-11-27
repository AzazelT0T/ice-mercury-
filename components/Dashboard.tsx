import React from 'react';
import { useData } from '../DataContext';
import { ContainerStatus } from '../types';
import { Thermometer, Droplets, Activity, AlertTriangle, ArrowRight, Bell, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, YAxis, XAxis } from 'recharts';

const Dashboard: React.FC = () => {
  const { containers, alerts, settings } = useData();
  const theme = settings.primaryColor;

  const totalContainers = containers.length;
  const criticalCount = containers.filter(c => c.status === ContainerStatus.CRITICAL).length;
  const atRiskCount = containers.filter(c => c.status === ContainerStatus.AT_RISK).length;
  const stableCount = containers.filter(c => c.status === ContainerStatus.STABLE).length;

  // Calculate System Status
  let systemStatus = { label: 'OPTIMAL', color: 'green', message: 'All systems functioning normally.' };
  if (criticalCount > 0) {
    systemStatus = { label: 'CRITICAL', color: 'red', message: `${criticalCount} containers require immediate attention.` };
  } else if (atRiskCount > 0) {
    systemStatus = { label: 'WARNING', color: 'yellow', message: `${atRiskCount} containers showing deviations.` };
  }

  // Aggregate Data for Main Chart (Average of all containers)
  // Assuming all containers have history of same length and timestamps roughly align
  const sampleHistory = containers[0]?.history || [];
  const chartData = sampleHistory.map((_, index) => {
    // For each timestamp index, calculate avg temp across all containers
    let sumTemp = 0;
    let count = 0;
    let timestamp = 0;
    
    containers.forEach(c => {
      if (c.history[index]) {
        sumTemp += c.history[index].temperature;
        timestamp = c.history[index].timestamp;
        count++;
      }
    });

    return {
      time: new Date(timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
      avgTemp: count > 0 ? parseFloat((sumTemp / count).toFixed(2)) : 0
    };
  });

  // Calculate Current Average Temp & Humidity
  const currentAvgTemp = (containers.reduce((acc, c) => acc + c.currentReading.temperature, 0) / (totalContainers || 1)).toFixed(1);
  const currentAvgHum = (containers.reduce((acc, c) => acc + c.currentReading.humidity, 0) / (totalContainers || 1)).toFixed(0);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & System Status Banner */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time cold chain monitoring overview</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
             <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-600 dark:text-slate-300 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Live Simulation
            </div>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className={`p-4 rounded-xl border flex items-center shadow-sm transition-colors
          ${systemStatus.label === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 
            systemStatus.label === 'WARNING' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}
        `}>
           <div className={`p-2 rounded-full mr-4 
             ${systemStatus.label === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200' : 
               systemStatus.label === 'WARNING' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200' : 
               'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'}
           `}>
             {systemStatus.label === 'OPTIMAL' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
           </div>
           <div>
             <h2 className={`font-bold text-lg 
               ${systemStatus.label === 'CRITICAL' ? 'text-red-800 dark:text-red-400' : 
                 systemStatus.label === 'WARNING' ? 'text-yellow-800 dark:text-yellow-400' : 
                 'text-green-800 dark:text-green-400'}
             `}>
               System Status: {systemStatus.label}
             </h2>
             <p className={`text-sm ${systemStatus.label === 'CRITICAL' ? 'text-red-700 dark:text-red-300' : systemStatus.label === 'WARNING' ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'}`}>
               {systemStatus.message}
             </p>
           </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Monitored</h3>
            <div className={`p-2 bg-${theme}-100 dark:bg-${theme}-900/30 rounded-lg text-${theme}-600 dark:text-${theme}-400`}>
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{totalContainers}</div>
          <p className="text-xs text-slate-400 mt-2">Active sensors</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Stable</h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <Thermometer size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{stableCount}</div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">Within safe range</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">At Risk</h3>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{atRiskCount}</div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Deviating range</p>
        </div>

        <div className={`p-5 rounded-xl border shadow-sm transition-colors ${criticalCount > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${criticalCount > 0 ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'} text-sm font-medium`}>Critical</h3>
            <div className={`${criticalCount > 0 ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'} p-2 rounded-lg`}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className={`text-3xl font-bold ${criticalCount > 0 ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>{criticalCount}</div>
          <p className={`${criticalCount > 0 ? 'text-red-600 dark:text-red-300' : 'text-slate-400'} text-xs mt-2`}>
            {criticalCount > 0 ? 'Immediate action required' : 'System healthy'}
          </p>
        </div>
      </div>

      {/* 3. Global Graph Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
              <Activity className="mr-2 text-blue-500" size={20} />
              Average Warehouse Conditions
            </h3>
         </div>
         
         <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={settings.darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="time" stroke={settings.darkMode ? '#94a3b8' : '#64748b'} fontSize={12} tick={{dy: 10}} minTickGap={30} />
                <YAxis stroke={settings.darkMode ? '#94a3b8' : '#64748b'} fontSize={12} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: settings.darkMode ? '#1e293b' : '#fff', 
                    borderColor: settings.darkMode ? '#334155' : '#e2e8f0',
                    color: settings.darkMode ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Area type="monotone" dataKey="avgTemp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>

         {/* Current Values Display below Graph */}
         <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="flex flex-col items-center">
               <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Current Avg Temp</span>
               <div className="flex items-end">
                  <Thermometer size={32} className="text-blue-500 mb-1 mr-2" />
                  <span className="text-4xl font-bold text-slate-800 dark:text-white">{currentAvgTemp}</span>
                  <span className="text-xl text-slate-400 dark:text-slate-500 mb-1 ml-1">°C</span>
               </div>
            </div>
            <div className="flex flex-col items-center border-l border-slate-100 dark:border-slate-700">
               <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Current Avg Humidity</span>
               <div className="flex items-end">
                  <Droplets size={32} className="text-cyan-500 mb-1 mr-2" />
                  <span className="text-4xl font-bold text-slate-800 dark:text-white">{currentAvgHum}</span>
                  <span className="text-xl text-slate-400 dark:text-slate-500 mb-1 ml-1">%</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - Container List Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
           <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800 dark:text-white">Inventory Status</h3>
             <Link to="/containers" className={`text-sm text-${theme}-600 dark:text-${theme}-400 font-medium flex items-center`}>
               View All <ArrowRight size={14} className="ml-1" />
             </Link>
           </div>
           <div className="p-0 overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
                 <tr>
                   <th className="px-6 py-3">Container ID</th>
                   <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3">Temp</th>
                   <th className="px-6 py-3">Humidity</th>
                   <th className="px-6 py-3">Last Update</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                 {containers.slice(0, 5).map(container => (
                   <tr key={container.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                     <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{container.id}</td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-semibold
                         ${container.status === ContainerStatus.STABLE ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 
                           container.status === ContainerStatus.AT_RISK ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}
                       `}>
                         {container.status}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={
                         container.currentReading.temperature > settings.tempMax || container.currentReading.temperature < settings.tempMin 
                         ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                       }>
                         {container.currentReading.temperature}°C
                       </span>
                     </td>
                     <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{container.currentReading.humidity}%</td>
                     <td className="px-6 py-4 text-slate-400 text-xs">Now</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Recent Alerts Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[400px] transition-colors">
           <div className="p-5 border-b border-slate-100 dark:border-slate-700">
             <h3 className="font-semibold text-slate-800 dark:text-white">Recent Alerts</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {alerts.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                 <Bell size={32} className="mb-2 opacity-20" />
                 <p className="text-sm">No recent alerts</p>
               </div>
             ) : (
               alerts.slice(0, 10).map(alert => (
                 <div key={alert.id} className={`p-3 rounded-lg border ${alert.active ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700'}`}>
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-semibold ${alert.severity === 'Critical' ? 'text-red-700 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {alert.severity}
                      </h4>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{alert.message}</p>
                    <div className="mt-2 flex justify-between items-center">
                       <span className="text-xs font-mono bg-white dark:bg-slate-900 px-1 rounded text-slate-500 dark:text-slate-400 border dark:border-slate-700">{alert.containerId}</span>
                       {alert.active ? (
                         <span className="text-[10px] uppercase font-bold text-red-500 animate-pulse">Active</span>
                       ) : (
                         <span className="text-[10px] uppercase font-bold text-green-500 dark:text-green-400">Resolved</span>
                       )}
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;