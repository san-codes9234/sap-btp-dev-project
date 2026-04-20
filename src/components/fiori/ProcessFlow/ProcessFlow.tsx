/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * Process Flow — mimics sap.suite.ui.commons.ProcessFlow
 * Horizontal flow showing O2C lifecycle stages with semantic colors:
 *   Green (#107E3E) = finished  |  Blue (#0A6ED1) = in_process  |  Gray = pending
 */

import { CheckCircle2, Circle, Loader2, FileText, Package, Truck, Receipt, CreditCard } from 'lucide-react';
import type { ProcessLog, StageStatus } from '../../../types';

const STAGE_ICONS: Record<string, React.ReactNode> = {
  'Inquiry':            <FileText size={16} />,
  'Quotation':          <FileText size={16} />,
  'Sales Order (VA01)': <Package size={16} />,
  'Delivery (VL01N)':   <Truck size={16} />,
  'Billing (VF01)':     <Receipt size={16} />,
  'Payment':            <CreditCard size={16} />,
};

const STATUS_STYLES: Record<StageStatus, {
  nodeRing: string;
  nodeBg: string;
  nodeIcon: string;
  labelColor: string;
  connectorBg: string;
  statusText: string;
  statusDot: string;
}> = {
  finished: {
    nodeRing: 'ring-2 ring-green-500 ring-offset-2',
    nodeBg: '#107E3E',
    nodeIcon: '#ffffff',
    labelColor: '#32363A',
    connectorBg: '#107E3E',
    statusText: 'Completed',
    statusDot: '#107E3E',
  },
  in_process: {
    nodeRing: 'ring-2 ring-blue-400 ring-offset-2',
    nodeBg: '#0A6ED1',
    nodeIcon: '#ffffff',
    labelColor: '#0A6ED1',
    connectorBg: '#D9E5F3',
    statusText: 'In Process',
    statusDot: '#0A6ED1',
  },
  pending: {
    nodeRing: '',
    nodeBg: '#EDEDED',
    nodeIcon: '#8A9BB0',
    labelColor: '#8A9BB0',
    connectorBg: '#EDEDED',
    statusText: 'Pending',
    statusDot: '#8A9BB0',
  },
};

function StageIcon({ stage, status }: { stage: string; status: StageStatus }) {
  const icon = STAGE_ICONS[stage] ?? <Circle size={16} />;
  if (status === 'finished') return <CheckCircle2 size={16} color="#fff" />;
  if (status === 'in_process') return <Loader2 size={16} color="#fff" className="animate-spin" />;
  return <span style={{ color: '#8A9BB0' }}>{icon}</span>;
}

interface ProcessFlowProps {
  logs: ProcessLog[];
}

export default function ProcessFlow({ logs }: ProcessFlowProps) {
  if (!logs.length) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-gray-400">
        No process log data available.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-max px-2 pt-2 pb-4">
        {logs.map((log, idx) => {
          const style = STATUS_STYLES[log.status] ?? STATUS_STYLES.pending;
          const isLast = idx === logs.length - 1;

          return (
            <div key={log.id} className="flex items-start">
              <div className="flex flex-col items-center gap-2 w-[120px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${style.nodeRing}`}
                  style={{ background: style.nodeBg }}
                >
                  <StageIcon stage={log.stage} status={log.status} />
                </div>

                <div className="flex flex-col items-center text-center gap-0.5 px-1">
                  <span
                    className="text-xs font-semibold leading-tight"
                    style={{ color: style.labelColor }}
                  >
                    {log.stage}
                  </span>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: style.statusDot }}
                    />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: style.statusDot }}
                    >
                      {style.statusText}
                    </span>
                  </div>

                  {log.status !== 'pending' && log.actor && log.actor !== 'System' && (
                    <span className="text-[10px] text-gray-400 mt-0.5 leading-none">
                      {log.actor}
                    </span>
                  )}

                  {log.status === 'finished' && log.timestamp && (
                    <span className="text-[10px] text-gray-400 leading-none mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex items-center mt-5 mx-0">
                  <div
                    className="h-[3px] w-8 rounded-full transition-all duration-300"
                    style={{
                      background:
                        log.status === 'finished'
                          ? '#107E3E'
                          : log.status === 'in_process'
                          ? 'linear-gradient(to right, #0A6ED1 40%, #EDEDED 100%)'
                          : '#EDEDED',
                    }}
                  />
                  <div
                    className="w-2 h-2 rounded-full border-2 transition-all duration-300"
                    style={{
                      borderColor:
                        log.status === 'finished'
                          ? '#107E3E'
                          : log.status === 'in_process'
                          ? '#0A6ED1'
                          : '#CCCCCC',
                      background: log.status === 'finished' ? '#107E3E' : '#fff',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 px-3 pt-1 border-t border-gray-100 mt-1">
        {[
          { status: 'finished', label: 'Completed' },
          { status: 'in_process', label: 'In Process' },
          { status: 'pending', label: 'Pending' },
        ].map(({ status, label }) => {
          const s = STATUS_STYLES[status as StageStatus];
          return (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: s.statusDot }}
              />
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
