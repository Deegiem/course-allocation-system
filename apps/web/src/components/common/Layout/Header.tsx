'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CircleHelp, Menu, Search, Settings } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const query = encodeURIComponent(searchQuery.trim());

    // Search across multiple pages - redirect to the most relevant
    // You can customize this logic based on your needs
    router.push(`/lecturers?search=${query}`);

    // Reset after navigation
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleSettingsClick = () => {
    router.push('/policies');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111a2d]/60 backdrop-blur">
      <div className="flex h-20 items-center gap-4 px-5 sm:px-6 lg:px-8">
        {/* Sidebar Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleSidebar}
            className="dashboard-icon-btn lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-9" />
          </button>
        </div>


        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative flex-1 max-w-md ml-2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-[#94a3b8]" />
          </div>
          <input
            type="text"
            placeholder="Search allocations, faculty, or courses..."
            className="dashboard-input"
            aria-label="Search allocations, faculty, or courses"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
          />
        </form>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            className="dashboard-icon-btn"
            aria-label="Notifications"
            onClick={() => router.push('/allocations')}
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            className="dashboard-icon-btn"
            aria-label="Help"
            onClick={() => window.open('https://github.com/Deegiem/course-allocation-system', '_blank')}
          >
            <CircleHelp className="h-5 w-5" />
          </button>

          <button
            className="dashboard-icon-btn"
            aria-label="Settings"
            onClick={handleSettingsClick}
          >
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