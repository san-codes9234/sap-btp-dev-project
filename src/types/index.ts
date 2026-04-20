/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 */

// ─── OData V4 Workflow Stage Types ───────────────────────────────────────────

export type StageStatus = 'finished' | 'in_process' | 'pending';

export type OrderStatus =
  | 'Inquiry'
  | 'Quotation'
  | 'Sales Order'
  | 'Shipped'
  | 'Billed'
  | 'Paid';

// ─── Entity Types (mirrors CDS schema) ────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  city: string;
  gstin: string;
  created_at: string;
}

export interface SalesOrder {
  id: string;
  customer_id: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
  expected_delivery: string | null;
  payment_terms: string;
  incoterms: string;
  customers?: Customer;
}

export interface SalesOrderWithCustomer extends SalesOrder {
  customers: Customer;
}

export interface OrderItem {
  id: string;
  order_id: string;
  material_code: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export interface ProcessLog {
  id: string;
  order_id: string;
  stage: string;
  status: StageStatus;
  actor: string;
  timestamp: string;
  remarks: string;
}

// ─── KPI Data (mimics @getDashboardKPIs OData function) ───────────────────────

export interface DashboardKPIs {
  totalOpenSales: number;
  pendingDeliveries: number;
  dso: number;
}

// ─── OData Context Shape ──────────────────────────────────────────────────────

export interface ODataContextType {
  salesOrders: SalesOrderWithCustomer[];
  customers: Customer[];
  kpis: DashboardKPIs;
  loading: boolean;
  error: string | null;
  getOrderById: (id: string) => SalesOrderWithCustomer | undefined;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
  getProcessLogs: (orderId: string) => Promise<ProcessLog[]>;
  refreshOrders: () => Promise<void>;
}

// ─── Filter / Sort State ──────────────────────────────────────────────────────

export type SortField = 'id' | 'amount' | 'created_at' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  status: OrderStatus | 'All';
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
