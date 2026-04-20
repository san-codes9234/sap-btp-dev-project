/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * Dashboard — Main List Report page
 * Combines KPI Header + List Report in a Fiori Quartz Light layout
 */

import { useOData } from '../context/ODataContext';
import KPICards from '../components/fiori/KPI/KPICards';
import ListReport from '../components/fiori/Table/ListReport';

interface DashboardProps {
  onSelectOrder: (id: string) => void;
}

export default function Dashboard({ onSelectOrder }: DashboardProps) {
  const { salesOrders, kpis, loading, error, refreshOrders } = useOData();

  return (
    <main className="flex-1 overflow-y-auto" style={{ background: '#F3F4F5' }}>
      <div className="px-4 sm:px-6 py-4 max-w-7xl mx-auto space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold" style={{ color: '#32363A' }}>
              Order-to-Cash Overview
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              NovaTex Industries Pvt. Ltd. &mdash; FY 2024-25 &middot; OData V4 · /O2CService
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded font-medium"
              style={{ background: '#EDF9F0', color: '#107E3E' }}
            >
              Live
            </span>
            <span className="text-[10px] text-gray-400">
              {new Date().toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Service Error:</strong> {error}
          </div>
        )}

        <KPICards kpis={kpis} loading={loading} />

        <ListReport
          orders={salesOrders}
          loading={loading}
          onSelectOrder={onSelectOrder}
          onRefresh={refreshOrders}
        />
      </div>
    </main>
  );
}
