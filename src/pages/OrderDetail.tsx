/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * Order Detail — Object Page pattern (sap.f.ObjectPage)
 * Sections: Header · Process Flow · Line Items · Process Logs · Order Attributes
 */

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Hash,
  Calendar,
  FileText,
  Anchor,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useOData } from '../context/ODataContext';
import type { OrderItem, ProcessLog } from '../types';
import ProcessFlow from '../components/fiori/ProcessFlow/ProcessFlow';
import StatusBadge from '../components/fiori/Table/StatusBadge';
import { formatIndianCurrency } from '../components/fiori/KPI/KPICards';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <div
        className="px-4 py-2.5 border-b border-gray-100"
        style={{ background: '#F7F7F7' }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5C6876' }}>
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function AttributeRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="w-4 flex-shrink-0 mt-0.5 text-gray-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-none mb-0.5">{label}</p>
        <p className="text-xs font-medium" style={{ color: '#32363A' }}>{value}</p>
      </div>
    </div>
  );
}

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const { getOrderById, getOrderItems, getProcessLogs } = useOData();
  const order = getOrderById(orderId);

  const [items, setItems] = useState<OrderItem[]>([]);
  const [logs, setLogs] = useState<ProcessLog[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    setItemsLoading(true);
    setLogsLoading(true);
    setItemsError(null);

    getOrderItems(orderId)
      .then(setItems)
      .catch(e => setItemsError(e.message))
      .finally(() => setItemsLoading(false));

    getProcessLogs(orderId)
      .then(setLogs)
      .finally(() => setLogsLoading(false));
  }, [orderId, getOrderItems, getProcessLogs]);

  if (!order) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ background: '#F3F4F5' }}>
        <div className="text-center">
          <AlertCircle size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Sales order "{orderId}" not found.</p>
          <button
            onClick={onBack}
            className="mt-3 text-xs underline"
            style={{ color: '#0A6ED1' }}
          >
            Back to List
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto" style={{ background: '#F3F4F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">

        <div
          className="bg-white rounded border border-gray-200 overflow-hidden"
        >
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(to right, #0A6ED1, #1A9898)' }}
          />
          <div className="px-4 sm:px-6 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs mb-4 hover:opacity-80 transition-opacity"
              style={{ color: '#0A6ED1' }}
            >
              <ArrowLeft size={13} />
              Back to Sales Orders
            </button>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold" style={{ color: '#32363A' }}>
                    {order.id}
                  </h1>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {order.customers?.name ?? '—'}
                  {order.customers?.city ? ` · ${order.customers.city}` : ''}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono">
                  GSTIN: {order.customers?.gstin ?? '—'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: '#32363A' }}>
                  ₹{formatIndianCurrency(Number(order.amount))}
                </p>
                <p className="text-xs text-gray-400">Net Order Value · INR</p>
                <div className="flex items-center justify-end gap-3 mt-2">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Payment Terms</p>
                    <p className="text-xs font-semibold" style={{ color: '#32363A' }}>{order.payment_terms}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Incoterms</p>
                    <p className="text-xs font-semibold" style={{ color: '#32363A' }}>{order.incoterms}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SectionCard title="Order-to-Cash Process Flow">
          {logsLoading ? (
            <div className="flex items-center justify-center h-24 gap-2 text-sm text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              Loading process flow...
            </div>
          ) : (
            <ProcessFlow logs={logs} />
          )}
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Line Items">
              {itemsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : itemsError ? (
                <p className="text-sm text-red-500">{itemsError}</p>
              ) : (
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Material', 'Description', 'Qty', 'UoM', 'Unit Price', 'Total'].map(h => (
                          <th
                            key={h}
                            className="py-2 pr-4 text-left text-[10px] uppercase tracking-wider text-gray-400 font-medium"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b border-gray-50">
                          <td className="py-2 pr-4 font-mono font-medium" style={{ color: '#0A6ED1' }}>
                            {item.material_code}
                          </td>
                          <td className="py-2 pr-4" style={{ color: '#32363A' }}>
                            {item.description}
                          </td>
                          <td className="py-2 pr-4 text-right tabular-nums">{item.quantity}</td>
                          <td className="py-2 pr-4 text-gray-500">{item.unit}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">
                            ₹{Number(item.unit_price).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 text-right tabular-nums font-semibold" style={{ color: '#32363A' }}>
                            ₹{formatIndianCurrency(Number(item.total_price))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200">
                        <td colSpan={5} className="py-2.5 text-right pr-4 text-xs font-semibold text-gray-500">
                          Net Order Total
                        </td>
                        <td className="py-2.5 text-right text-sm font-bold" style={{ color: '#32363A' }}>
                          ₹{formatIndianCurrency(Number(order.amount))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Process Log History">
              {logsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-0">
                  {logs.map((log, idx) => {
                    const isLast = idx === logs.length - 1;
                    const colorMap: Record<string, string> = {
                      finished: '#107E3E',
                      in_process: '#0A6ED1',
                      pending: '#8A9BB0',
                    };
                    const color = colorMap[log.status] ?? '#8A9BB0';
                    return (
                      <div key={log.id} className="flex gap-3">
                        <div className="flex flex-col items-center pt-1">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                            style={{ background: color }}
                          />
                          {!isLast && (
                            <div
                              className="w-px flex-1 min-h-[20px]"
                              style={{ background: log.status === 'pending' ? '#EDEDED' : `${color}40` }}
                            />
                          )}
                        </div>
                        <div className="pb-4 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold" style={{ color: '#32363A' }}>
                              {log.stage}
                            </p>
                            {log.status !== 'pending' && log.timestamp && (
                              <span className="text-[10px] text-gray-400 flex-shrink-0">
                                {new Date(log.timestamp).toLocaleDateString('en-IN', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                          {log.remarks && (
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{log.remarks}</p>
                          )}
                          {log.actor && log.actor !== 'System' && (
                            <p className="text-[10px] text-gray-400 mt-0.5">by {log.actor}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Order Attributes">
              <AttributeRow
                icon={<Building2 size={13} />}
                label="Sold-To Party"
                value={order.customers?.name ?? '—'}
              />
              <AttributeRow
                icon={<MapPin size={13} />}
                label="Ship-To City"
                value={order.customers?.city ?? '—'}
              />
              <AttributeRow
                icon={<Hash size={13} />}
                label="Customer GSTIN"
                value={order.customers?.gstin ?? '—'}
              />
              <AttributeRow
                icon={<Calendar size={13} />}
                label="Order Date"
                value={new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              />
              <AttributeRow
                icon={<Calendar size={13} />}
                label="Expected Delivery"
                value={
                  order.expected_delivery
                    ? new Date(order.expected_delivery).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })
                    : '—'
                }
              />
              <AttributeRow
                icon={<FileText size={13} />}
                label="Payment Terms"
                value={order.payment_terms}
              />
              <AttributeRow
                icon={<Anchor size={13} />}
                label="Incoterms"
                value={order.incoterms}
              />
            </SectionCard>

            <div className="bg-white rounded border border-gray-200 p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">
                Technical Reference
              </p>
              <div className="space-y-1.5">
                {[
                  { k: 'Entity', v: 'SalesOrders' },
                  { k: 'Service', v: 'O2CService' },
                  { k: 'Protocol', v: 'OData V4' },
                  { k: 'Key', v: order.id },
                  { k: 'Tcode', v: order.status === 'Sales Order' ? 'VA01' : order.status === 'Shipped' ? 'VL01N' : order.status === 'Billed' ? 'VF01' : 'VA11' },
                ].map(({ k, v }) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{k}</span>
                    <span className="text-[10px] font-mono font-medium" style={{ color: '#32363A' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
