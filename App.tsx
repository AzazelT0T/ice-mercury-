import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './DataContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContainerList from './components/ContainerList';
import ContainerDetail from './components/ContainerDetail';
import AlertsPanel from './components/AlertsPanel';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="containers" element={<ContainerList />} />
            <Route path="containers/:id" element={<ContainerDetail />} />
            <Route path="alerts" element={<AlertsPanel />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;