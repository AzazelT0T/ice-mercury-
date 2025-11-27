import React from 'react';
import { useData } from '../DataContext';
import { THEME_COLORS } from '../constants';
import { Save, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useData();

  const handleNumChange = (field: keyof typeof settings, value: string) => {
    updateSettings({ [field]: parseFloat(value) });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-800">Configuration</h1>
          <p className="text-slate-500 text-sm mt-1">System thresholds and interface preferences</p>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Safety Thresholds</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Temperature (°C)</label>
             <input 
               type="number" 
               value={settings.tempMin}
               onChange={(e) => handleNumChange('tempMin', e.target.value)}
               className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Temperature (°C)</label>
             <input 
               type="number" 
               value={settings.tempMax}
               onChange={(e) => handleNumChange('tempMax', e.target.value)}
               className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Max Humidity (%)</label>
             <input 
               type="number" 
               value={settings.humidityMax}
               onChange={(e) => handleNumChange('humidityMax', e.target.value)}
               className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Alert Trigger Sensitivity (Seconds)</label>
             <input 
               type="number" 
               min="1"
               max="10"
               value={settings.consecutiveViolationsTrigger}
               onChange={(e) => handleNumChange('consecutiveViolationsTrigger', e.target.value)}
               className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
             <p className="text-xs text-slate-400 mt-1">Number of consecutive violations required to trigger alert.</p>
           </div>
         </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Interface Theme</h2>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {THEME_COLORS.map(color => (
             <button
               key={color.value}
               onClick={() => updateSettings({ primaryColor: color.value })}
               className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2
                 ${settings.primaryColor === color.value 
                   ? `border-${color.value}-500 bg-${color.value}-50` 
                   : 'border-transparent bg-slate-50 hover:bg-slate-100'}
               `}
             >
               <div className={`w-8 h-8 rounded-full bg-${color.value}-500 shadow-sm`}></div>
               <span className={`text-sm font-medium ${settings.primaryColor === color.value ? `text-${color.value}-700` : 'text-slate-600'}`}>
                 {color.name}
               </span>
             </button>
           ))}
         </div>
       </div>

       <div className="flex justify-end pt-4">
         <button className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-lg">
           <Save size={18} />
           <span>Settings Auto-Saved</span>
         </button>
       </div>
    </div>
  );
};

export default Settings;