import React from 'react';

function Search() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`
          relative flex items-center
          bg-[var(--secondary)] rounded-lg
          border transition-all duration-200
          ${
            isFocused
              ? 'border-[var(--chart-1)] shadow-lg shadow-[var(--chart-1)]/20'
              : 'border-[var(--border)]'
          }
        `}
      >
        {/* Search Icon */}
        <div className="pl-4 pr-3">
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-[var(--chart-1)]' : 'text-[var(--muted-foreground)]'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search..."
          className="
            flex-1 bg-transparent py-2.5 pr-4
            text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
            focus:outline-none text-sm
          "
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="
              mr-3 p-1 rounded-md
              text-[var(--muted-foreground)] hover:text-[var(--foreground)]
              hover:bg-[var(--accent)] transition-all duration-200
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Keyboard Shortcut Hint */}
        {!isFocused && !searchQuery && (
          <div className="mr-3 px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-medium">
            ⌘K
          </div>
        )}
      </div>

      {/* Gradient border effect on focus */}
      <div
        className={`
          absolute inset-0 rounded-lg -z-10
          bg-gradient-to-r from-[var(--chart-1)] to-[var(--chart-4)]
          transition-opacity duration-200
          ${isFocused ? 'opacity-20 blur-xl' : 'opacity-0'}
        `}
      />
    </div>
  );
}

export { Search};