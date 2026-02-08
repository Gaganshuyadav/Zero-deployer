import React from 'react';
import { DarkLightSwitch } from '../buttons/DarkLight';
import { Search } from '@/components/common-components/search/Search';

export default function DashBoardHeaderMain() {
  return (
    <nav className="bg-[var(--navbar-bg)] border-b border-[var(--navbar-border)] w-[100%] flex items-center justify-between">
      <div className="max-w-7xl mx-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold text-[var(--navbar-text)]">
              Zero-Deployer
            </div>

            {/* Nav Items */}
            <div className="flex text-[var(--navbar-text)]">
              jdsadsasasas
            </div>
          </div>
        </div>
      </div>

      {/* Right side - optional user menu or actions */}
      <div className="flex items-center justify-end space-x-4 mr-4">
        <button className="p-2 rounded-lg text-[var(--navbar-icon)] hover:text-[var(--navbar-icon-hover)] hover:bg-[var(--navbar-button-hover)] transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <Search/>
        <DarkLightSwitch/>
      </div>
    </nav>
  );
}