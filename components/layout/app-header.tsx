"use client";

import { Search, Command, Bell } from "lucide-react";

export function AppHeader({
  title,
  subtitle,
  actions,
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/40">
      <div className="h-16 px-6 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          {title && (
            <div className="text-sm font-semibold text-ink-900 truncate">
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-xs text-ink-500 truncate">{subtitle}</div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-400" />
            <input
              placeholder="스킬 / Work Unit / Hook 검색"
              className="h-9 w-full pl-9 pr-12 rounded-lg border border-ink-200 bg-white/70 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
            />
            <kbd className="absolute right-2 top-1.5 inline-flex items-center gap-0.5 rounded border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] text-ink-500">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <button className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-ink-200 bg-white/70 hover:bg-white">
            <Bell className="h-4 w-4 text-ink-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
