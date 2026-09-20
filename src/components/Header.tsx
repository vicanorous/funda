import React, { useState } from 'react';
import { NotificationItem, User } from '../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  notifications: NotificationItem[];
  displayCurrency?: 'USD' | 'NGN';
  onToggleCurrency?: () => void;
  onSelectNotification?: (route: string) => void;
  onNavigateProfile?: () => void;
  onStartOnboarding?: () => void;
  userProfile?: User;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  notifications,
  displayCurrency = 'USD',
  onToggleCurrency,
  onSelectNotification,
  onNavigateProfile,
  onStartOnboarding,
  userProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const initials = userProfile?.name
    ? userProfile.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'VN';

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
            <div className="w-8 h-8 rounded-xl bg-[#004ac6] flex items-center justify-center text-white shadow-sm font-bold">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="5" width="14" height="2.5" rx="1.25" fill="white" />
                <rect x="3" y="10.5" width="10" height="2.5" rx="1.25" fill="white" />
                <rect x="3" y="16" width="6" height="2.5" rx="1.25" fill="white" />
                <circle cx="17.5" cy="11.75" r="2.5" fill="#6ffbbe" />
              </svg>
            </div>

            {title ? (
              <h1 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold tracking-tight text-[#0b1c30] truncate max-w-[150px]">
                {title}
              </h1>
            ) : (
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-['Plus_Jakarta_Sans'] text-[18px] text-[#0b1c30] font-bold tracking-tight">
                    funda<span className="text-[#004ac6]">.</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#004ac6] text-white text-[9px] uppercase font-extrabold tracking-wider">
                    NG
                  </span>
                </div>
                <span className="text-[10px] text-[#737686] font-medium tracking-tight">
                  Multi-Sig Treasury
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & User Avatar */}
        <div className="flex items-center gap-1.5 relative">
          {userProfile && userProfile.isOnboarded === false && onStartOnboarding && (
            <button
              onClick={onStartOnboarding}
              className="px-2.5 py-1 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold text-[11px] shadow-2xs cursor-pointer flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[13px]">how_to_reg</span>
              <span>Onboard</span>
            </button>
          )}

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative min-w-[40px] min-h-[40px] w-10 h-10 rounded-full flex items-center justify-center text-[#434655] hover:text-[#0b1c30] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f8f9ff] animate-pulse" />
            )}
          </button>

          <button
            onClick={onNavigateProfile}
            title={userProfile?.name ? `${userProfile.name} (Treasury Admin)` : 'Treasury Admin'}
            className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-sm min-w-[32px] min-h-[32px] cursor-pointer hover:opacity-90 active:scale-95 transition-all text-[12px] font-bold"
            aria-label="User Profile"
          >
            {initials}
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
