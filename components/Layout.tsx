import React, { useState } from 'react';
import { useData } from '../DataContext';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Box, Bell, Settings, Menu, X, Snowflake } from 'lucide-react';

const Layout: React.FC = () => {
  const { settings, alerts } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeAlertCount = alerts.filter(a => a.active).length;
  
  // Dynamic theme class builder
  const themeColor = settings.primaryColor;
  
  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive 
        ? `bg-${themeColor}-100 dark:bg-${themeColor}-900/30 text-${themeColor}-800 dark:text-${themeColor}-400 font-semibold border-r-4 border-${themeColor}-600 dark:border-${themeColor}-500` 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row font-sans transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm z-20">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-bold text-xl">
           <Snowflake className={`text-${themeColor}-600 dark:text-${themeColor}-400`} />
           <span>Ice Mercury</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-800 dark:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-2xl border-b border-slate-100 dark:border-slate-700">
             <div className={`p-2 bg-${themeColor}-50 dark:bg-slate-700 rounded-lg`}>
               <Snowflake className={`text-${themeColor}-600 dark:text-${themeColor}-400 h-8 w-8`} />
             </div>
             <span>Ice Mercury</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink to="/" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/containers" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <Box size={20} />
              <span>Inventory</span>
            </NavLink>
            <NavLink to="/alerts" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative">
                <Bell size={20} />
                {activeAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span>Alerts</span>
              {activeAlertCount > 0 && (
                <span className="ml-auto bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeAlertCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/settings" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <div className={`bg-${themeColor}-50 dark:bg-slate-700/50 p-4 rounded-xl`}>
              <p className={`text-${themeColor}-800 dark:text-${themeColor}-300 text-sm font-medium`}>System Status</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Raspberry Pi: Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 scrollbar-hide">
        <Outlet />
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;