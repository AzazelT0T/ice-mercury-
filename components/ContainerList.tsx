import React from 'react';
import { useData } from '../DataContext';
import { ContainerStatus } from '../types';
import { Link } from 'react-router-dom';
import { Thermometer, Droplets, Zap } from 'lucide-react';

const ContainerList: React.FC = () => {
  const { containers, settings } = useData();
  const theme = settings.primaryColor;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tracked Containers</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage active pharmaceutical shipments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {containers.map(container => (
          <Link key={container.id} to={`/containers/${container.id}`} className="group relative block">
            <div className={`
              absolute inset-0 rounded-xl transform transition-transform duration-200 shadow-sm
              ${container.status === ContainerStatus.CRITICAL ? 'bg-red-500' : 
                container.status === ContainerStatus.AT_RISK ? 'bg-yellow-400' : `bg-${theme}-500`}
              group-hover:translate-x-1 group-hover:translate-y-1
            `}></div>
            
            <div className="relative bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col justify-between group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
               
               {/* Header */}
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center space-x-3">
                   <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                     <img src={container.imageUrl} alt={container.name} className="w-full h-full object-cover opacity-80" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{container.id}</h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400">{container.drugName}</p>
                   </div>
                 </div>
                 <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${container.status === ContainerStatus.STABLE ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 
                      container.status === ContainerStatus.AT_RISK ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}
                 `}>
                   {container.status}
                 </div>
               </div>

               {/* Metrics */}
               <div className="grid grid-cols-2 gap-4 my-2">
                 <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs mb-1">
                      <Thermometer size={14} className="mr-1" /> Temp
                    </div>
                    <div className={`text-2xl font-bold ${
                      (container.currentReading.temperature > settings.tempMax || container.currentReading.temperature < settings.tempMin) 
                      ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'
                    }`}>
                      {container.currentReading.temperature}°C
                    </div>
                 </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs mb-1">
                      <Droplets size={14} className="mr-1" /> Humidity
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                      {container.currentReading.humidity}%
                    </div>
                 </div>
               </div>

               {/* Footer */}
               <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                 <span>Batch: {container.batchNumber}</span>
                 {container.isCoolingActive && (
                    <span className="flex items-center text-blue-500 dark:text-blue-400 font-bold animate-pulse">
                      <Zap size={12} className="mr-1" /> Cooling Active
                    </span>
                 )}
               </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContainerList;