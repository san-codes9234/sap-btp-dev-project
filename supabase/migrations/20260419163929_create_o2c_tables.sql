/*
  # O2C Management Portal - Database Schema
  
  ## Overview
  Creates all tables required for the Order-to-Cash lifecycle management system
  for NovaTex Industries Pvt. Ltd.

  ## Tables Created
  
  ### customers
  - id (uuid, pk): Unique customer identifier
  - name (text): Customer display name
  - city (text): Customer city
  - gstin (text): GST Identification Number
  - created_at (timestamptz): Record creation timestamp
  
  ### sales_orders
  - id (text, pk): Sales order number e.g. SO-5501
  - customer_id (uuid, fk): References customers.id
  - amount (numeric): Total order amount in INR
  - status (text): Current workflow status
  - created_at (timestamptz): Order creation date
  - expected_delivery (date): Expected delivery date
  - payment_terms (text): Payment terms e.g. Net 30
  - incoterms (text): Incoterms code
  
  ### order_items
  - id (uuid, pk): Line item identifier
  - order_id (text, fk): References sales_orders.id
  - material_code (text): SAP material number
  - description (text): Material description
  - quantity (integer): Ordered quantity
  - unit (text): Unit of measure
  - unit_price (numeric): Price per unit in INR
  - total_price (numeric): Line item total
  
  ### process_logs
  - id (uuid, pk): Log entry identifier
  - order_id (text, fk): References sales_orders.id
  - stage (text): Workflow stage name
  - status (text): finished | in_process | pending
  - actor (text): User who performed the action
  - timestamp (timestamptz): When the action occurred
  - remarks (text): Optional remarks
  
  ## Security
  - RLS enabled on all tables
  - Public read access allowed (demo portal — no auth required)
  - Insert/update/delete restricted to authenticated users
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  gstin text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read customers"
  ON customers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS sales_orders (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  amount numeric(15,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Inquiry',
  created_at timestamptz DEFAULT now(),
  expected_delivery date,
  payment_terms text NOT NULL DEFAULT 'Net 30',
  incoterms text NOT NULL DEFAULT 'CIF'
);

ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read sales_orders"
  ON sales_orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert sales_orders"
  ON sales_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update sales_orders"
  ON sales_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES sales_orders(id) ON DELETE CASCADE,
  material_code text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'EA',
  unit_price numeric(15,2) NOT NULL DEFAULT 0,
  total_price numeric(15,2) NOT NULL DEFAULT 0
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read order_items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert order_items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS process_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES sales_orders(id) ON DELETE CASCADE,
  stage text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  actor text NOT NULL DEFAULT 'System',
  timestamp timestamptz DEFAULT now(),
  remarks text NOT NULL DEFAULT ''
);

ALTER TABLE process_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read process_logs"
  ON process_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert process_logs"
  ON process_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
