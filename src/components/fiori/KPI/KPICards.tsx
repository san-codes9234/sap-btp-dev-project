/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * KPI Header Cards — mimics sap.f.Card with NumericHeader
 * Displays: Total Open Sales, Pending Deliveries, Days Sales Outstanding
 */

import { TrendingUp, Truck, Clock } from 'lucide-react';
import type { DashboardKPIs } from '../../../types';

interface KPICardsProps {
  kpis: DashboardKPIs;
  loading: boolean;
}

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  accentColor: string;
  loading: boolean;
  subtitle?: string;
}

function KPICard({
  title,
  value,
  unit,
  icon,
  accentColor,
  loading,
  trend,
  trendUp,
  subtitle,
}: KPICardProps) {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="h-1 w-full" style={{ background: accentColor }} />
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider leading-none mb-3">
            {title}
          </p>
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: `${accentColor}18` }}
          >
            {icon}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 mt-1">
            <div className="h-7 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold" style={{ color: '#32363A' }}>
                {value}
              </span>
              {unit && (
                <span className="text-sm font-medium text-gray-500">{unit}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              {subtitle && (
                <p className="text-xs text-gray-400">{subtitle}</p>
              )}
              {trend && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    trendUp ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  <TrendingUp size={11} />
                  <span>{trend}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(2)} L`;
  }
  return amount.toLocaleString('en-IN');
}

export default function KPICards({ kpis, loading }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KPICard
        title="Total Open Sales"
        value={`₹${formatIndianCurrency(kpis.totalOpenSales)}`}
        icon={<TrendingUp size={16} color="#0A6ED1" />}
        accentColor="#0A6ED1"
        loading={loading}
        trend="+12.4% MTD"
        trendUp={true}
        subtitle="Excl. paid orders"
      />
      <KPICard
        title="Pending Deliveries"
        value={String(kpis.pendingDeliveries)}
        unit="Orders"
        icon={<Truck size={16} color="#E9730C" />}
        accentColor="#E9730C"
        loading={loading}
        trend="-2 vs last week"
        trendUp={false}
        subtitle="Awaiting outbound delivery"
      />
      <KPICard
        title="Days Sales Outstanding"
        value={String(kpis.dso)}
        unit="Days"
        icon={<Clock size={16} color="#1A9898" />}
        accentColor="#1A9898"
        loading={loading}
        trend="-3.1 vs Q1"
        trendUp={true}
        subtitle="Receivables performance"
      />
    </div>
  );
}
