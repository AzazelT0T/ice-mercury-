import React from 'react';
import { useData } from '../DataContext';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlertsPanel: React.FC = () => {
  const { alerts, resetAlert } = useData();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Alerts</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Audit log of cold chain violations</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        {alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-200 dark:text-green-900" />
            <p>No alerts recorded in this session.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {alerts.map(alert => (
              <li key={alert.id} className={`p-6 transition-colors ${alert.active ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full flex-shrink-0 ${alert.severity === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-800 dark:text-white">{alert.severity} Alert</h3>
                        <span className="text-sm font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{alert.containerId}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{alert.message}</p>
                      <div className="flex items-center mt-2 text-xs text-slate-400 dark:text-slate-500 space-x-4">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        {alert.active && <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Ongoing Violation</span>}
                      </div>
                    </div>
                  </div>
                  
                  {alert.active && (
                    <button 
                      onClick={() => resetAlert(alert.id)}
                      className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-slate-800 transition-colors whitespace-nowrap"
                    >
                      Acknowledge
                    </button>
                  )}
                  {!alert.active && alert.resolvedAt && (
                     <div className="text-right">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                         Resolved
                       </span>
                       <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                         at {new Date(alert.resolvedAt).toLocaleTimeString()}
                       </p>
                     </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;