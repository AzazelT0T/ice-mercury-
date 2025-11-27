import React from 'react';
import { useData } from '../DataContext';
import { THEME_COLORS } from '../constants';
import { Save, Sun, Moon } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useData();

  const handleNumChange = (field: keyof typeof settings, value: string) => {
    updateSettings({ [field]: parseFloat(value) });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configuration</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">System thresholds and interface preferences</p>
       </div>

       {/* Appearance */}
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
         <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">Appearance</h2>
         
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${settings.darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-orange-100 text-orange-500'}`}>
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {THEME_COLORS.map(color => (
             <button
               key={color.value}
               onClick={() => updateSettings({ primaryColor: color.value })}
               className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2
                 ${settings.primaryColor === color.value 
                   ? `border-${color.value}-500 bg-${color.value}-50 dark:bg-opacity-10 dark:border-opacity-100` 
                   : 'border-transparent bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'}
               `}
             >
               <div className={`w-8 h-8 rounded-full bg-${color.value}-500 shadow-sm`}></div>
               <span className={`text-sm font-medium ${settings.primaryColor === color.value ? `text-${color.value}-700 dark:text-${color.value}-400` : 'text-slate-600 dark:text-slate-300'}`}>
                 {color.name}
               </span>
             </button>
           ))}
         </div>
       </div>

       {/* Safety Thresholds */}
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
         <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">Safety Thresholds</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minimum Temperature (°C)</label>
             <input 
               type="number" 
               value={settings.tempMin}
               onChange={(e) => handleNumChange('tempMin', e.target.value)}
               className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maximum Temperature (°C)</label>
             <input 
               type="number" 
               value={settings.tempMax}
               onChange={(e) => handleNumChange('tempMax', e.target.value)}
               className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Humidity (%)</label>
             <input 
               type="number" 
               value={settings.humidityMax}
               onChange={(e) => handleNumChange('humidityMax', e.target.value)}
               className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alert Trigger Sensitivity (Seconds)</label>
             <input 
               type="number" 
               min="1"
               max="10"
               value={settings.consecutiveViolationsTrigger}
               onChange={(e) => handleNumChange('consecutiveViolationsTrigger', e.target.value)}
               className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
             />
             <p className="text-xs text-slate-400 mt-1">Number of consecutive violations required to trigger alert.</p>
           </div>
         </div>
       </div>

       <div className="flex justify-end pt-4">
         <button className="flex items-center space-x-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors shadow-lg">
           <Save size={18} />
           <span>Settings Auto-Saved</span>
         </button>
       </div>
    </div>
  );
};

export default Settings;