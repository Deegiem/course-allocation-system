'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);   // desktop collapse state
  const [mobileOpen, setMobileOpen] = useState(false);   // mobile drawer state

  return (
    <div className="dashboard-shell">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'
        }`}
      >
        <Header toggleSidebar={() => setMobileOpen(true)} />
        <main className="px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}