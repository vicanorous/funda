import React from 'react';

export type TabKey = 'home' | 'joint' | 'transfer' | 'activity';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-white/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.03)] border-t border-[#e5eeff]/50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-1">
        {/* Tab 1: Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 transition-all gap-0.5 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[11px] font-semibold">Home</span>
        </button>

        {/* Tab 2: Joint */}
        <button
          onClick={() => onTabChange('joint')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 transition-all gap-0.5 cursor-pointer ${
            activeTab === 'joint'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">group</span>
          <span className="text-[11px] font-semibold">Joint</span>
        </button>

        {/* Tab 3: Transfer / FX */}
        <button
          onClick={() => onTabChange('transfer')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 transition-all gap-0.5 cursor-pointer ${
            activeTab === 'transfer'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          <span className="text-[11px] font-semibold">Transfer</span>
        </button>

        {/* Tab 4: Activity */}
        <button
          onClick={() => onTabChange('activity')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 transition-all gap-0.5 cursor-pointer ${
            activeTab === 'activity'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span className="text-[11px] font-semibold">Activity</span>
        </button>
      </div>
    </nav>
  );
};
