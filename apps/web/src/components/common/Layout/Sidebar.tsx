'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  QrCode,
  ShieldCheck,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Lecturers', href: '/lecturers', icon: Users },
  { label: 'Courses', href: '/courses', icon: BookOpen },
  { label: 'Allocations', href: '/allocations', icon: ClipboardList },
  { label: 'Reports', href: '/reports', icon: QrCode },
  { label: 'Policies', href: '/policies', icon: ShieldCheck },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const closeMobileSidebar = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen border-r border-white/10 bg-[#182133] transition-all duration-300
          ${isOpen ? 'w-64' : 'w-29'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#a8c0ff] text-[#12203d] shadow-md">
              <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
            </div>

            {isOpen && (
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <h2 className="truncate text-lg font-bold tracking-tight text-[#8fb2ff]">
                  EduAlloc
                </h2>
                <p className="truncate text-xs font-medium text-[#aeb9d4]">
                  Academic Admin
                </p>
              </div>
            )}

            {/* Mobile close — mobile only */}
            <div className="lg:hidden">
              <button
                onClick={closeMobileSidebar}
                className="dashboard-icon-btn ml-auto shrink-0 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>


            {/* Collapse/expand — desktop only */}
            <div className="sm:hidden lg:flex">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`dashboard-icon-btn sm:hidden shrink-0 lg:flex ${isOpen ? '' : 'ml-auto'}`}
                aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${!isOpen ? 'justify-center px-3' : ''
                      }`}
                    title={!isOpen ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={2.1} />
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}