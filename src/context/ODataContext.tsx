/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * OData V4 Model Provider (Context)
 * Simulates a @sap/ui5-model/v4/ODataModel binding layer.
 * Fetches data from Supabase (CAP-like backend).
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  ODataContextType,
  SalesOrderWithCustomer,
  Customer,
  DashboardKPIs,
  OrderItem,
  ProcessLog,
} from '../types';

// ─── Context Creation ─────────────────────────────────────────────────────────

const ODataContext = createContext<ODataContextType | null>(null);

// ─── KPI Calculation (mirrors @getDashboardKPIs OData function) ───────────────

function computeKPIs(orders: SalesOrderWithCustomer[]): DashboardKPIs {
  const openStatuses: string[] = ['Inquiry', 'Quotation', 'Sales Order', 'Shipped', 'Billed'];

  const totalOpenSales = orders
    .filter(o => openStatuses.includes(o.status))
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const pendingDeliveries = orders.filter(
    o => o.status === 'Inquiry' || o.status === 'Quotation' || o.status === 'Sales Order'
  ).length;

  const paidOrders = orders.filter(o => o.status === 'Paid');
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.amount), 0);
  const avgDailyRevenue = totalRevenue / 90;
  const dso = avgDailyRevenue > 0
    ? parseFloat((totalOpenSales / avgDailyRevenue).toFixed(1))
    : 42.5;

  return { totalOpenSales, pendingDeliveries, dso };
}

// ─── Provider Component ───────────────────────────────────────────────────────

export function ODataProvider({ children }: { children: React.ReactNode }) {
  const [salesOrders, setSalesOrders] = useState<SalesOrderWithCustomer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs>({ totalOpenSales: 0, pendingDeliveries: 0, dso: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('sales_orders')
        .select('*, customers(*)')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });

      if (customersError) throw customersError;

      const orders = (ordersData || []) as SalesOrderWithCustomer[];
      setSalesOrders(orders);
      setCustomers(customersData || []);
      setKpis(computeKPIs(orders));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data from OData service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getOrderById = useCallback(
    (id: string) => salesOrders.find(o => o.id === id),
    [salesOrders]
  );

  const getOrderItems = useCallback(async (orderId: string): Promise<OrderItem[]> => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('material_code', { ascending: true });

    if (error) throw error;
    return (data || []) as OrderItem[];
  }, []);

  const getProcessLogs = useCallback(async (orderId: string): Promise<ProcessLog[]> => {
    const { data, error } = await supabase
      .from('process_logs')
      .select('*')
      .eq('order_id', orderId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return (data || []) as ProcessLog[];
  }, []);

  const value: ODataContextType = {
    salesOrders,
    customers,
    kpis,
    loading,
    error,
    getOrderById,
    getOrderItems,
    getProcessLogs,
    refreshOrders: fetchOrders,
  };

  return <ODataContext.Provider value={value}>{children}</ODataContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOData(): ODataContextType {
  const ctx = useContext(ODataContext);
  if (!ctx) throw new Error('useOData must be used within ODataProvider');
  return ctx;
}
