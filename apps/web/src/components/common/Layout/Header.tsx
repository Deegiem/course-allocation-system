'use client';

import React from 'react';
import { Bell, CircleHelp, Menu, Search, Settings } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111a2d]/95 backdrop-blur">
      <div className="flex h-18 items-center gap-4 px-5 sm:px-6 lg:px-8">
        <button
          onClick={toggleSidebar}
          className="dashboard-icon-btn lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-9" />
        </button>

        <div className="relative w-full flex flex-row gap-x-2 items-center">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7f8aa8]" />
          <input
            type="text"
            placeholder="Search allocations, faculty, or courses..."
            className="dashboard-input pl-11"
            aria-label="Search allocations, faculty, or courses"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button className="dashboard-icon-btn" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>

          <button className="dashboard-icon-btn" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </button>

          <button className="dashboard-icon-btn" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>

          <div className="ml-2 hidden border-l border-white/10 pl-5 text-sm font-semibold text-[#d8e3ff] md:block">
            Admin Mode
          </div>
        </div>
      </div>
    </header>
  );
}