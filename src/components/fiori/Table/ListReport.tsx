/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * List Report — mimics sap.ui.comp.smarttable.SmartTable
 * Supports: Search, Filter by Status, Sort by field/direction
 */

import { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  RefreshCcw,
  Download,
} from 'lucide-react';
import type {
  SalesOrderWithCustomer,
  FilterState,
  SortState,
  SortField,
  OrderStatus,
} from '../../../types';
import StatusBadge from './StatusBadge';
import { formatIndianCurrency } from '../KPI/KPICards';

const STATUS_OPTIONS: Array<OrderStatus | 'All'> = [
  'All',
  'Inquiry',
  'Quotation',
  'Sales Order',
  'Shipped',
  'Billed',
  'Paid',
];

interface ListReportProps {
  orders: SalesOrderWithCustomer[];
  loading: boolean;
  onSelectOrder: (id: string) => void;
  onRefresh: () => void;
}

function SortIcon({ field, sort }: { field: SortField; sort: SortState }) {
  if (sort.field !== field) return <ArrowUpDown size={13} className="text-gray-400" />;
  return sort.direction === 'asc'
    ? <ArrowUp size={13} style={{ color: '#0A6ED1' }} />
    : <ArrowDown size={13} style={{ color: '#0A6ED1' }} />;
}

export default function ListReport({ orders, loading, onSelectOrder, onRefresh }: ListReportProps) {
  const [filter, setFilter] = useState<FilterState>({ search: '', status: 'All' });
  const [sort, setSort] = useState<SortState>({ field: 'created_at', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    setSort(prev =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );
  };

  const filtered = useMemo(() => {
    let result = [...orders];

    if (filter.status !== 'All') {
      result = result.filter(o => o.status === filter.status);
    }

    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.customers?.name?.toLowerCase().includes(q) ||
          o.status.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA: string | number, valB: string | number;
      switch (sort.field) {
        case 'id':       valA = a.id; valB = b.id; break;
        case 'amount':   valA = Number(a.amount); valB = Number(b.amount); break;
        case 'status':   valA = a.status; valB = b.status; break;
        default:         valA = a.created_at; valB = b.created_at;
      }
      if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, filter, sort]);

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold" style={{ color: '#32363A' }}>
            Sales Orders
          </h2>
          <span className="text-xs text-gray-400 font-normal">
            ({filtered.length} of {orders.length})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={filter.search}
              onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 w-52"
              style={{ '--tw-ring-color': '#0A6ED1' } as React.CSSProperties}
            />
          </div>

          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border rounded transition-colors ${
              showFilters || filter.status !== 'All'
                ? 'border-blue-400 text-blue-600 bg-blue-50'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {filter.status !== 'All' && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#0A6ED1' }}
              />
            )}
          </button>

          <button
            onClick={onRefresh}
            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-500"
            title="Refresh"
          >
            <RefreshCcw size={13} />
          </button>

          <button
            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-500"
            title="Export"
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium mr-1">Status:</span>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(f => ({ ...f, status: s }))}
              className={`px-2.5 py-0.5 text-xs rounded-full border transition-colors ${
                filter.status === s
                  ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200" style={{ background: '#F7F7F7' }}>
              {([
                { label: 'Sales Order', field: 'id' as SortField, width: 'w-28' },
                { label: 'Sold-To Party', field: null, width: 'w-48' },
                { label: 'Net Value (INR)', field: 'amount' as SortField, width: 'w-36' },
                { label: 'Status', field: 'status' as SortField, width: 'w-36' },
                { label: 'Created On', field: 'created_at' as SortField, width: 'w-28' },
                { label: 'Exp. Delivery', field: null, width: 'w-28' },
                { label: '', field: null, width: 'w-10' },
              ]).map(({ label, field, width }) => (
                <th
                  key={label || 'action'}
                  className={`px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${width} ${
                    field ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                  }`}
                  onClick={() => field && handleSort(field)}
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    {field && <SortIcon field={field} sort={sort} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={28} className="text-gray-300" />
                    <p className="text-sm text-gray-400">No sales orders match your filter criteria.</p>
                    <button
                      onClick={() => setFilter({ search: '', status: 'All' })}
                      className="text-xs mt-1 hover:underline"
                      style={{ color: '#0A6ED1' }}
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(order => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                  className="border-b border-gray-100 cursor-pointer hover:bg-blue-50/40 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <span className="font-semibold text-xs" style={{ color: '#0A6ED1' }}>
                      {order.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-medium" style={{ color: '#32363A' }}>
                        {order.customers?.name ?? '—'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {order.customers?.city ?? ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: '#32363A' }}>
                      ₹{formatIndianCurrency(Number(order.amount))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {order.expected_delivery
                      ? new Date(order.expected_delivery).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-blue-400 transition-colors"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-gray-400">
          OData V4 · /O2CService/SalesOrders
        </span>
      </div>
    </div>
  );
}
