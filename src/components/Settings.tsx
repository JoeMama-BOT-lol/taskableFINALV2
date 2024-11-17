import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Sun, Moon, ZoomIn, List, Calendar } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { UserButton, useClerk } from '@clerk/clerk-react';

const zoomLevels = [
  { value: 1, label: '100%' },
  { value: 1.25, label: '125%' },
  { value: 1.5, label: '150%' },
  { value: 2, label: '200%' },
];

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { isDark, showNumbering, zoom, showDayOfWeek, showYear, setDark, setShowNumbering, setZoom, setShowDayOfWeek, setShowYear } = useSettings();
  const { signOut } = useClerk();  // Use the useClerk hook to get the signOut function

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ redirectUrl: window.location.origin }); // Redirect after sign-out
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Settings"
      >
        <SettingsIcon size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[240px] space-y-4"
        >
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={() => setDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun size={20} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon size={20} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Show Numbers */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Numbers</span>
            <button
              onClick={() => setShowNumbering(!showNumbering)}
              className={`p-2 rounded-full transition-colors ${
                showNumbering
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={`Toggle number display`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Show Day of Week */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Day of Week</span>
            <button
              onClick={() => setShowDayOfWeek(!showDayOfWeek)}
              className={`p-2 rounded-full transition-colors ${
                showDayOfWeek
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={`Toggle day of week display`}
            >
              <Calendar size={20} />
            </button>
          </div>

          {/* Show Year */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Year</span>
            <button
              onClick={() => setShowYear(!showYear)}
              className={`p-2 rounded-full transition-colors ${
                showYear
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={`Toggle year display`}
            >
              <Calendar size={20} />
            </button>
          </div>

          {/* Zoom Level */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Zoom Level
            </label>
            <div className="relative">
              <select
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Select zoom level"
              >
                {zoomLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <ZoomIn className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* User Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Account</span>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonBox: "hover:opacity-80 transition-opacity",
                    userButtonTrigger: "focus:shadow-none",
                    userButtonPopoverCard: "dark:bg-gray-800 dark:border-gray-700",
                    userButtonPopoverText: "dark:text-gray-200",
                    userButtonPopoverActionButton: "dark:hover:bg-gray-700",
                    userButtonPopoverFooter: "dark:border-gray-700"
                  }
                }}
              />
              {/* Manual sign out button */}
              <button
                onClick={handleSignOut}
                className="p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
