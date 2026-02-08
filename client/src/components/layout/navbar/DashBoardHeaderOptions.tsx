import React from 'react';
import { Link } from 'react-router';

export default function DashBoardHeaderOptions() {
  const [activeTab, setActiveTab] = React.useState('Overview');

  const navItems = 
  [
    { name: 'Overview', path: '/overview'},
    { name: 'Deployments', path: '/deployments' },
    { name: 'Projects',    path: '/projects' },
    { name: 'Teams',       path: '/teams' },
    { name: 'Settings',    path: '/settings' },
    { name: 'Integrations',path: '/integrations' }
  ];

  return (
    <nav className="bg-[var(--navbar-bg)] border-b border-[var(--navbar-border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">

            {/* Nav Items */}
            <div className="flex space-x-1">
              {navItems?.map((item:{ name:string, path:string}) => (
                <Link to={`${item.path}`}>
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      activeTab === item.name
                        ? 'text-white bg-[var(--navbar-border)]'
                        : 'text-[var(--navbar-icon)] hover:text-white hover:bg-[var(--navbar-border)]/50'
                    }
                    before:absolute before:inset-0 before:rounded-lg
                    before:bg-gradient-to-r before:from-blue-500 before:to-purple-500
                    before:opacity-0 hover:before:opacity-10
                    before:transition-opacity before:duration-200
                  `}
                >
                  <span className="relative z-10">{item.name}</span>
                </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - optional user menu or actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-[var(--navbar-icon)] hover:text-white hover:bg-[var(--navbar-border)] transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

