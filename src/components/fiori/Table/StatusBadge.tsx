/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * StatusBadge — mimics sap.m.ObjectStatus with semantic colors
 */

import type { OrderStatus } from '../../../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  Inquiry:      { label: 'Inquiry',      bg: '#F3F4F5', text: '#5C6876', dot: '#8A9BB0' },
  Quotation:    { label: 'Quotation',    bg: '#FFF3E0', text: '#E65100', dot: '#E9730C' },
  'Sales Order':{ label: 'Sales Order',  bg: '#E8F1FD', text: '#0854A0', dot: '#0A6ED1' },
  Shipped:      { label: 'Shipped (PGI)',bg: '#EAF6FF', text: '#0070B1', dot: '#1A9898' },
  Billed:       { label: 'Billed',       bg: '#EDF9F0', text: '#107E3E', dot: '#107E3E' },
  Paid:         { label: 'Paid',         bg: '#EDF9F0', text: '#107E3E', dot: '#107E3E' },
};

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Inquiry'];
  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${px}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}
