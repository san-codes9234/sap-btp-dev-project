/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * CDS Domain Model — @sap/cds Domain Definition (Simulated)
 * This file represents the CAP DB layer schema.
 * In a real SAP BTP project, this would be compiled to HANA artifacts.
 *
 * @sap/cds version: ^7.x
 */

/*
namespace com.novatex.o2c;

using { managed, cuid } from '@sap/cds/common';

// ─── Customers Entity ────────────────────────────────────────────────────────
@title: 'Customers'
entity Customers : cuid, managed {
  @title: 'Customer Name'
  name        : String(100) not null;

  @title: 'City'
  city        : String(50);

  @title: 'GSTIN'
  gstin       : String(20);

  // Composition: A customer can have many sales orders
  orders      : Composition of many SalesOrders on orders.customer = $self;
}

// ─── SalesOrders Entity ──────────────────────────────────────────────────────
@title: 'Sales Orders'
@odata.draft.enabled: true
entity SalesOrders : cuid, managed {
  @title: 'Sales Order ID'
  id              : String(10) not null;

  @title: 'Customer'
  customer        : Association to Customers;

  @Measures.ISOCurrency: currency_code
  @title: 'Net Amount (INR)'
  amount          : Decimal(15,2);
  currency_code   : String(3) default 'INR';

  @title: 'Order Status'
  @assert.range: true
  status          : String(30) enum {
    Inquiry       = 'Inquiry';
    Quotation     = 'Quotation';
    SalesOrder    = 'Sales Order';
    Shipped       = 'Shipped';
    Billed        = 'Billed';
    Paid          = 'Paid';
  };

  @title: 'Expected Delivery'
  expectedDelivery: Date;

  @title: 'Payment Terms'
  paymentTerms    : String(20) default 'Net 30';

  @title: 'Incoterms'
  incoterms       : String(10) default 'CIF';

  // Compositions
  items           : Composition of many OrderItems on items.order = $self;
  processLogs     : Composition of many ProcessLogs on processLogs.order = $self;
}

// ─── OrderItems Entity ───────────────────────────────────────────────────────
@title: 'Order Line Items'
entity OrderItems : cuid {
  order           : Association to SalesOrders;

  @title: 'Material Code'
  materialCode    : String(20);

  @title: 'Description'
  description     : String(200);

  @title: 'Quantity'
  quantity        : Integer default 1;

  @title: 'Unit of Measure'
  unit            : String(5) default 'EA';

  @title: 'Unit Price (INR)'
  unitPrice       : Decimal(15,2);

  @title: 'Total Price (INR)'
  totalPrice      : Decimal(15,2);
}

// ─── ProcessLogs Entity ──────────────────────────────────────────────────────
@title: 'Process Logs'
entity ProcessLogs : cuid, managed {
  order           : Association to SalesOrders;

  @title: 'Workflow Stage'
  stage           : String(50);

  @title: 'Stage Status'
  @assert.range: true
  status          : String(20) enum {
    finished   = 'finished';
    in_process = 'in_process';
    pending    = 'pending';
  };

  @title: 'Performed By'
  actor           : String(100);

  @title: 'Timestamp'
  timestamp       : DateTime;

  @title: 'Remarks'
  remarks         : String(500);
}
*/
