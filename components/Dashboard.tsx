import React from 'react';
import { useData } from '../DataContext';
import { ContainerStatus } from '../types';
import { Thermometer, Droplets, Activity, AlertTriangle, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const { containers, alerts, settings } = useData();
  const theme = settings.primaryColor;

  const totalContainers = containers.length;
  const criticalCount = containers.filter(c => c.status === ContainerStatus.CRITICAL).length;
  const atRiskCount = containers.filter(c => c.status === ContainerStatus.AT_RISK).length;
  const stableCount = containers.filter(c => c.status === ContainerStatus.STABLE).length;

  // Aggregate some history for a mini sparkline
  const sparkData = containers[0]?.history.map((h, i) => ({
    name: i,
    temp: h.temperature
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time cold chain monitoring overview</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600 flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Simulating
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 text-sm font-medium">Total Monitored</h3>
            <div className={`p-2 bg-${theme}-100 rounded-lg text-${theme}-600`}>
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalContainers}</div>
          <p className="text-xs text-slate-400 mt-2">Active sensors</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 text-sm font-medium">Stable</h3>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Thermometer size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stableCount}</div>
          <p className="text-xs text-green-600 mt-2">Within {settings.tempMin}° - {settings.tempMax}°C</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 text-sm font-medium">At Risk</h3>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{atRiskCount}</div>
          <p className="text-xs text-yellow-600 mt-2">Deviating from safe range</p>
        </div>

        <div className={`p-5 rounded-xl border shadow-sm ${criticalCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${criticalCount > 0 ? 'text-red-700' : 'text-slate-500'} text-sm font-medium`}>Critical</h3>
            <div className={`${criticalCount > 0 ? 'bg-red-200 text-red-700' : 'bg-red-100 text-red-600'} p-2 rounded-lg`}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className={`text-3xl font-bold ${criticalCount > 0 ? 'text-red-700' : 'text-slate-800'}`}>{criticalCount}</div>
          <p className={`${criticalCount > 0 ? 'text-red-600' : 'text-slate-400'} text-xs mt-2`}>
            {criticalCount > 0 ? 'Immediate action required' : 'System healthy'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - Container List Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-5 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800">Inventory Status</h3>
             <Link to="/containers" className={`text-sm text-${theme}-600 hover:text-${theme}-700 font-medium flex items-center`}>
               View All <ArrowRight size={14} className="ml-1" />
             </Link>
           </div>
           <div className="p-0">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-medium">
                 <tr>
                   <th className="px-6 py-3">Container ID</th>
                   <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3">Temp</th>
                   <th className="px-6 py-3">Humidity</th>
                   <th className="px-6 py-3">Last Update</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {containers.map(container => (
                   <tr key={container.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4 font-medium text-slate-900">{container.id}</td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-semibold
                         ${container.status === ContainerStatus.STABLE ? 'bg-green-100 text-green-700' : 
                           container.status === ContainerStatus.AT_RISK ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                       `}>
                         {container.status}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={
                         container.currentReading.temperature > settings.tempMax || container.currentReading.temperature < settings.tempMin 
                         ? 'text-red-600 font-bold' : 'text-slate-700'
                       }>
                         {container.currentReading.temperature}°C
                       </span>
                     </td>
                     <td className="px-6 py-4 text-slate-600">{container.currentReading.humidity}%</td>
                     <td className="px-6 py-4 text-slate-400 text-xs">Now</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Recent Alerts Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
           <div className="p-5 border-b border-slate-100">
             <h3 className="font-semibold text-slate-800">Recent Alerts</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {alerts.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <Bell size={32} className="mb-2 opacity-20" />
                 <p className="text-sm">No recent alerts</p>
               </div>
             ) : (
               alerts.slice(0, 10).map(alert => (
                 <div key={alert.id} className={`p-3 rounded-lg border ${alert.active ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-semibold ${alert.severity === 'Critical' ? 'text-red-700' : 'text-orange-600'}`}>
                        {alert.severity}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alert.message}</p>
                    <div className="mt-2 flex justify-between items-center">
                       <span className="text-xs font-mono bg-white px-1 rounded text-slate-500 border">{alert.containerId}</span>
                       {alert.active ? (
                         <span className="text-[10px] uppercase font-bold text-red-500 animate-pulse">Active</span>
                       ) : (
                         <span className="text-[10px] uppercase font-bold text-green-500">Resolved</span>
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