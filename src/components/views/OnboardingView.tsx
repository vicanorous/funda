import React, { useState, useEffect } from 'react';
import { usePollar } from '@pollar/react';
import { User } from '../../types';

interface OnboardingViewProps {
  initialUser?: User;
  onComplete: (
    userData: Partial<User>,
    initialVault?: { name: string; currency: string; balance?: number },
  ) => void;
  onCancel?: () => void;
  isExistingUser?: boolean;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialUser,
  onComplete,
  onCancel,
}) => {
  const pollar = usePollar();
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [preferredCurrency, setPreferredCurrency] = useState<'USD' | 'NGN'>(
    initialUser?.preferredCurrency || 'NGN',
  );

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  // Pick up the real wallet address once Pollar login succeeds
  useEffect(() => {
    if (pollar.wallet?.address) {
      setIsConnecting(false);
    }
  }, [pollar.wallet?.address]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setConnectError(null);
    try {
      await pollar.login({ provider: 'google' });
    } catch (err) {
      console.error('Pollar login failed:', err);
      setConnectError('Could not connect. Try again.');
      setIsConnecting(false);
    }
  };

  const handleFinish = () => {
    onComplete({
      name,
      email,
      preferredCurrency,
      walletAddress: pollar.wallet?.address || '',
      kycStatus: 'UNVERIFIED',
    });
  };

  return (
    <div className="flex flex-col w-full space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#0b1c30]">
          {step === 1 ? 'Create your account' : 'Connect your wallet'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#737686]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-2.5 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-[13px] font-bold text-[#0b1c30] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#737686] uppercase tracking-wider block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-2.5 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-[13px] font-bold text-[#0b1c30] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPreferredCurrency('NGN')}
              className={`p-2.5 rounded-xl border text-[13px] font-bold ${
                preferredCurrency === 'NGN'
                  ? 'border-[#004ac6] bg-[#eff4ff] text-[#004ac6]'
                  : 'border-[#e5eeff] bg-white text-[#434655]'
              }`}
            >
              🇳🇬 NGN
            </button>
            <button
              type="button"
              onClick={() => setPreferredCurrency('USD')}
              className={`p-2.5 rounded-xl border text-[13px] font-bold ${
                preferredCurrency === 'USD'
                  ? 'border-[#004ac6] bg-[#eff4ff] text-[#004ac6]'
                  : 'border-[#e5eeff] bg-white text-[#434655]'
              }`}
            >
              🇺🇸 USD
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!name.trim() || !email.trim()}
            className="w-full py-3 rounded-xl bg-[#004ac6] text-white font-bold text-[13px] disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff]/60 space-y-3 text-center">
          {pollar.wallet?.address ? (
            <>
              <div className="p-3 bg-[#eff4ff] rounded-xl">
                <span className="text-[11px] text-[#737686] block mb-1">Wallet connected</span>
                <span className="font-mono text-[12px] font-bold text-[#0b1c30] break-all">
                  {pollar.wallet.address}
                </span>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-[#004ac6] text-white font-bold text-[13px]"
              >
                Enter Funda
              </button>
            </>
          ) : (
            <>
              <p className="text-[12px] text-[#737686]">
  Sign in — takes a few seconds.
</p>
<button
  type="button"
  onClick={handleConnectWallet}
  disabled={isConnecting}
  className="w-full py-3 rounded-xl bg-[#004ac6] text-white font-bold text-[13px] disabled:opacity-50"
>
  {isConnecting ? 'Setting up your wallet...' : 'Sign in & Create Wallet'}
</button>
              {connectError && (
                <p className="text-[11px] text-red-500">{connectError}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};