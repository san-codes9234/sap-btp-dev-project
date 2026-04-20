/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * App Root — Fiori Shell layout with client-side routing via state
 * Wraps the entire application with the OData V4 Context Provider
 */

import { useState } from 'react';
import { ODataProvider } from './context/ODataContext';
import ShellHeader from './components/fiori/Shell/ShellHeader';
import Dashboard from './pages/Dashboard';
import OrderDetail from './pages/OrderDetail';

type View = { type: 'dashboard' } | { type: 'detail'; orderId: string };

function AppContent() {
  const [view, setView] = useState<View>({ type: 'dashboard' });

  const breadcrumbs =
    view.type === 'detail'
      ? [
          { label: 'Sales Orders', onClick: () => setView({ type: 'dashboard' }) },
          { label: view.orderId },
        ]
      : [{ label: 'Sales Orders' }];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F3F4F5' }}>
      <ShellHeader breadcrumbs={breadcrumbs} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {view.type === 'dashboard' ? (
          <Dashboard
            onSelectOrder={id => setView({ type: 'detail', orderId: id })}
          />
        ) : (
          <OrderDetail
            orderId={view.orderId}
            onBack={() => setView({ type: 'dashboard' })}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ODataProvider>
      <AppContent />
    </ODataProvider>
  );
}
