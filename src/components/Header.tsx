import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  notifications: NotificationItem[];
  onSelectNotification?: (route: string) => void;
  onNavigateProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  notifications,
  onSelectNotification,
  onNavigateProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-4 max-w-md mx-auto flex items-center justify-between">
        {/* Left: Back or Brand */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full flex items-center justify-center text-[#0b1c30] hover:text-[#004ac6] transition-colors cursor-pointer active:scale-95"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            onClick={onBack}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            {/* Funda Official Icon Badge */}
            <div className="w-8 h-8 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-sm font-bold">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="5" width="14" height="2.5" rx="1.25" fill="white" />
                <rect x="3" y="10.5" width="10" height="2.5" rx="1.25" fill="white" />
                <rect x="3" y="16" width="6" height="2.5" rx="1.25" fill="white" />
                <circle cx="17.5" cy="11.75" r="2.5" fill="#93c5fd" />
              </svg>
            </div>

            {title ? (
              <h1 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold tracking-tight text-[#0b1c30] truncate max-w-[170px]">
                {title}
              </h1>
            ) : (
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-['Plus_Jakarta_Sans'] text-[18px] text-[#0b1c30] font-bold tracking-tight">
                    funda<span className="text-[#2563eb]">.</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#e5eeff] text-[#434655] text-[10px] uppercase font-bold tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium tracking-tight">
                  Powered by Pollar
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & User Avatar */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center text-[#434655] hover:text-[#0b1c30] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#004ac6] ring-2 ring-[#f8f9ff] animate-pulse" />
            )}
          </button>

          <button
            onClick={onNavigateProfile}
            className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-sm min-w-[32px] min-h-[32px] cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            aria-label="User Profile"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-xl border border-[#e5eeff] p-3 z-50 flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#eff4ff]">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#0b1c30]">
                  Notifications
                </span>
                <span className="text-[11px] font-semibold text-[#004ac6]">
                  {unreadCount} unread
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (n.linkRoute && onSelectNotification) {
                        onSelectNotification(n.linkRoute);
                      }
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                      n.isRead ? 'bg-[#f8f9ff]' : 'bg-[#eff4ff] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[13px] text-[#0b1c30]">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#737686]">{n.timeAgo}</span>
                    </div>
                    <p className="text-[12px] text-[#434655] mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
