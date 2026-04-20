/*
 * SAP BTP Capstone Project: O2C Management
 * Developer: Sankalp Kumar (23053359)
 * Tech: React, Tailwind, SAP Fiori 3.0
 *
 * Fiori Shell Header — mimics sap.f.ShellBar
 * Color: SAP Shell #354A5F
 */

import { Bell, Settings, HelpCircle, Grid3x3, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface ShellHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export default function ShellHeader({ breadcrumbs }: ShellHeaderProps) {
  return (
    <header
      className="w-full flex flex-col"
      style={{ background: '#354A5F' }}
    >
      <div className="flex items-center justify-between px-4 h-[44px]">
        <div className="flex items-center gap-3">
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            aria-label="App Launcher"
          >
            <Grid3x3 size={18} color="#fff" />
          </button>

          <div className="w-px h-5 bg-white/20" />

          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white"
              style={{ background: '#0A6ED1' }}
            >
              N
            </div>
            <span className="text-white font-semibold text-sm tracking-wide select-none">
              NovaTex O2C Portal
            </span>
          </div>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <>
              <div className="w-px h-5 bg-white/20" />
              <nav className="flex items-center gap-1">
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    {idx > 0 && <ChevronRight size={12} color="rgba(255,255,255,0.5)" />}
                    <button
                      onClick={crumb.onClick}
                      className={`text-xs transition-colors ${
                        idx === breadcrumbs.length - 1
                          ? 'text-white font-medium cursor-default'
                          : 'text-white/60 hover:text-white/90 cursor-pointer'
                      }`}
                    >
                      {crumb.label}
                    </button>
                  </span>
                ))}
              </nav>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={17} color="rgba(255,255,255,0.85)" />
            <span
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-[#354A5F]"
              style={{ background: '#E9730C' }}
            />
          </button>

          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            aria-label="Help"
          >
            <HelpCircle size={17} color="rgba(255,255,255,0.85)" />
          </button>

          <button
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            aria-label="Settings"
          >
            <Settings size={17} color="rgba(255,255,255,0.85)" />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          <div className="flex items-center gap-2 pl-1 cursor-pointer group">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white select-none"
              style={{ background: '#0A6ED1' }}
            >
              SK
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-white text-xs font-medium">Sankalp Kumar</span>
              <span className="text-white/50 text-[10px]">23053359</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
