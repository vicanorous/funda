import React, { useState, useEffect } from 'react';
import { usePollar } from '@pollar/react';
import { Header } from './components/Header';
import { BottomNav, TabKey } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { JointAccountsView } from './components/views/JointAccountsView';
import { VaultDetailView } from './components/views/VaultDetailView';
import { AuditableLedgerView } from './components/views/AuditableLedgerView';
import { PersonalWalletView } from './components/views/PersonalWalletView';
import { DepositFundsView } from './components/views/DepositFundsView';
import { FxExchangeView } from './components/views/FxExchangeView';
import { CashOutView } from './components/views/CashOutView';
import { ActivityView } from './components/views/ActivityView';
import { MerkleProofModal } from './components/views/MerkleProofModal';
import { CreateJointAccountModal } from './components/views/CreateJointAccountModal';
import { DepositResolutionModal } from './components/views/DepositResolutionModal';
import { FundaStore } from './lib/pollar/store';
import { JointAccount, Transaction, PersonalWalletState } from './types';

export default function App() {
  const pollar = usePollar();
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [fundaState, setFundaState] = useState(() => FundaStore.loadState());
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'NGN'>(
    () => FundaStore.loadState().preferredCurrency || 'NGN',
  );

  // Modals state
  const [merkleModal, setMerkleModal] = useState<{ open: boolean; txHash?: string }>({
    open: false,
  });
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync on-chain balance from Pollar SDK
  useEffect(() => {
    if (pollar?.walletBalance?.step === 'loaded' && pollar.walletBalance.data?.balances) {
      let onChainUsd = 0;
      let onChainNgn = 0;
      const rawBalances = pollar.walletBalance.data.balances;
      for (const b of rawBalances) {
        const val = parseFloat(String(b.balance ?? '0')) || 0;
        const code = (b.code || '').toUpperCase();
        if (code === 'USDC' || code === 'USD' || code === 'USDT') {
          onChainUsd += val;
        } else if (code === 'NGN' || code === 'NGNC') {
          onChainNgn += val;
        } else if (code === 'XLM' || b.type === 'native') {
          onChainUsd += val * 0.12;
        } else {
          onChainUsd += val;
        }
      }
      FundaStore.syncOnChainBalances(onChainUsd, onChainNgn, pollar.wallet?.address);
    }
  }, [pollar?.walletBalance, pollar?.wallet?.address]);

  // Sync with FundaStore event system
  useEffect(() => {
    const handleStoreUpdate = () => {
      const freshState = FundaStore.loadState();
      setFundaState(freshState);
      setDisplayCurrency(freshState.preferredCurrency || 'NGN');
    };

    window.addEventListener('funda_state_updated', handleStoreUpdate);
    return () => {
      window.removeEventListener('funda_state_updated', handleStoreUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleCurrency = () => {
    const nextCur: 'USD' | 'NGN' = displayCurrency === 'USD' ? 'NGN' : 'USD';
    setDisplayCurrency(nextCur);
    FundaStore.setPreferredCurrency(nextCur);
    showToast(`Display switched to ${nextCur === 'NGN' ? 'Nigerian Naira (₦)' : 'US Dollar ($)'}`);
  };

  // Determine active tab for bottom navigation
  let activeTab: TabKey = 'home';
  if (currentRoute === 'home') activeTab = 'home';
  else if (currentRoute === 'joint' || currentRoute === 'vault-detail' || currentRoute === 'ledger')
    activeTab = 'joint';
  else if (currentRoute === 'wallet/exchange' || currentRoute === 'transfer') activeTab = 'transfer';
  else if (currentRoute === 'activity') activeTab = 'activity';

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'home') setCurrentRoute('home');
    else if (tab === 'joint') setCurrentRoute('joint');
    else if (tab === 'transfer') setCurrentRoute('wallet/exchange');
    else if (tab === 'activity') setCurrentRoute('activity');
  };

  // View title logic for header
  let headerTitle: string | undefined = undefined;
  let showBack = false;

  if (currentRoute === 'vault-detail') {
    headerTitle = 'Vault Multi-Sig Detail';
    showBack = true;
  } else if (currentRoute === 'ledger') {
    headerTitle = 'Auditable Ledger';
    showBack = true;
  } else if (currentRoute === 'wallet') {
    headerTitle = 'Personal Treasury';
    showBack = true;
  } else if (currentRoute === 'wallet/fund') {
    headerTitle = 'Deposit Funds';
    showBack = true;
  } else if (currentRoute === 'wallet/exchange') {
    headerTitle = 'FX Exchange';
    showBack = true;
  } else if (currentRoute === 'wallet/cash-out') {
    headerTitle = 'Disburse Funds';
    showBack = true;
  }

  const handleBack = () => {
    if (currentRoute === 'vault-detail' || currentRoute === 'ledger') {
      setCurrentRoute('joint');
    } else if (
      currentRoute === 'wallet/fund' ||
      currentRoute === 'wallet/cash-out' ||
      currentRoute === 'wallet'
    ) {
      setCurrentRoute('home');
    } else {
      setCurrentRoute('home');
    }
  };

  // Action callbacks that update the persistent FundaStore
  const handleDepositSuccess = (amount: number, depositCurrency: 'USD' | 'NGN' = 'NGN') => {
    FundaStore.addDeposit(amount, depositCurrency, 'Pollar Virtual NUBAN Direct Deposit');
    showToast(
      depositCurrency === 'NGN'
        ? `Deposited ₦${amount.toLocaleString()} NGN via Pollar Virtual NUBAN`
        : `Deposited $${amount.toLocaleString()} USD via Pollar USD Gateway`,
    );
    setCurrentRoute('home');
  };

  const handleFxSuccess = (
    fromAmount: number,
    toAmount: number,
    fromCurrency: string,
    toCurrency: string,
    targetVaultId?: string,
  ) => {
    const rate = fromAmount > 0 ? toAmount / fromAmount : 1;
    FundaStore.executeFxSwap(fromAmount, toAmount, fromCurrency, toCurrency, rate);
    showToast(
      `Exchanged ${fromCurrency} ${fromAmount.toLocaleString()} → ${toCurrency} ${toAmount.toLocaleString()}`,
    );
    setCurrentRoute('home');
  };

  const handleCashOutSuccess = (
    amount: number,
    bankDest: string,
    currency: 'USD' | 'NGN',
    fee: number = 0,
  ) => {
    FundaStore.executeCashOut(amount, currency, bankDest, fee);
    showToast(
      currency === 'NGN'
        ? `Disbursed ₦${amount.toLocaleString()} NGN to ${bankDest} via NIBSS NIP`
        : `Disbursed $${amount.toLocaleString()} USD to ${bankDest}`,
    );
    setCurrentRoute('home');
  };

  const handleCreateVault = (newAccountData: Partial<JointAccount>) => {
    const created = FundaStore.createVault(newAccountData);
    showToast(`Deployed Multi-Sig Vault "${created.name}" on Pollar Core`);
  };

  const handleResolveUnknown = (role: 'CONTRIBUTOR' | 'CO_OWNER', memoText: string) => {
    showToast(`Admitted Emeka K. Obi as ${role === 'CO_OWNER' ? 'Co-Owner' : 'Contributor'}`);
  };

  const handleVoteDecision = (txId: string, decision: 'APPROVED' | 'REJECTED') => {
    FundaStore.voteOnProposal(txId, decision);
    showToast(`Consensus vote recorded: ${decision}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col items-center">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 z-50 max-w-sm mx-auto px-4 py-3 bg-[#0b1c30] text-white rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce text-[13px] font-semibold border border-white/20">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[20px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        title={headerTitle}
        showBack={showBack}
        onBack={handleBack}
        notifications={fundaState.notifications}
        onSelectNotification={(route) => setCurrentRoute(route)}
        onNavigateProfile={() => setCurrentRoute('wallet')}
        displayCurrency={displayCurrency}
        onToggleCurrency={handleToggleCurrency}
        userProfile={fundaState.user}
      />

      {/* Main Responsive View Container (Max-w-md matching the mobile app screens) */}
      <main className="w-full max-w-md px-4 pt-3 flex-1 flex flex-col">
        {currentRoute === 'home' && (
          <HomeView
            jointAccounts={fundaState.jointAccounts}
            personalWallet={fundaState.personalWallet}
            transactions={fundaState.transactions}
            displayCurrency={displayCurrency}
            onToggleCurrency={handleToggleCurrency}
            onNavigate={(route) => setCurrentRoute(route)}
            onOpenVault={(id) => {
              setCurrentRoute('vault-detail');
            }}
            onOpenWithdrawalReview={() => setCurrentRoute('vault-detail')}
          />
        )}

        {currentRoute === 'joint' && (
          <JointAccountsView
            jointAccounts={fundaState.jointAccounts}
            displayCurrency={displayCurrency}
            onOpenVault={(id) => setCurrentRoute('vault-detail')}
            onOpenWithdrawalReview={() => setCurrentRoute('vault-detail')}
            onOpenLedgerAudit={() => setCurrentRoute('ledger')}
            onOpenCreateModal={() => setIsCreateVaultOpen(true)}
            onDepositJoint={(vaultId) => setCurrentRoute('wallet/fund')}
          />
        )}

        {currentRoute === 'vault-detail' && (
          <VaultDetailView
            onBack={() => setCurrentRoute('joint')}
            onViewLedger={() => setCurrentRoute('ledger')}
            onVoteDecision={handleVoteDecision}
          />
        )}

        {currentRoute === 'ledger' && (
          <AuditableLedgerView
            transactions={fundaState.transactions}
            displayCurrency={displayCurrency}
            onOpenMerkleProof={(hash) => setMerkleModal({ open: true, txHash: hash })}
            onOpenDepositResolution={() => setIsResolutionOpen(true)}
          />
        )}

        {currentRoute === 'wallet' && (
          <PersonalWalletView
            walletState={fundaState.personalWallet}
            displayCurrency={displayCurrency}
            onToggleCurrency={handleToggleCurrency}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        )}

        {currentRoute === 'wallet/fund' && (
          <DepositFundsView
            onBack={() => setCurrentRoute('home')}
            onSuccess={(amount, depositCurrency) => handleDepositSuccess(amount, depositCurrency)}
          />
        )}

        {currentRoute === 'wallet/exchange' && (
          <FxExchangeView
            onBack={() => setCurrentRoute('home')}
            onSuccess={handleFxSuccess}
          />
        )}

        {currentRoute === 'wallet/cash-out' && (
          <CashOutView
            onBack={() => setCurrentRoute('home')}
            onSuccess={handleCashOutSuccess}
          />
        )}

        {currentRoute === 'activity' && (
          <ActivityView
            transactions={fundaState.transactions}
            displayCurrency={displayCurrency}
            onOpenMerkleProof={(hash) => setMerkleModal({ open: true, txHash: hash })}
          />
        )}
      </main>

      {/* Global Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Merkle Proof Receipt Modal */}
      {merkleModal.open && (
        <MerkleProofModal
          txHash={merkleModal.txHash}
          onClose={() => setMerkleModal({ open: false })}
        />
      )}

      {/* Create New Joint Account Modal */}
      {isCreateVaultOpen && (
        <CreateJointAccountModal
          onClose={() => setIsCreateVaultOpen(false)}
          onCreate={handleCreateVault}
        />
      )}

      {/* Resolve Depositor Status Modal */}
      {isResolutionOpen && (
        <DepositResolutionModal
          onClose={() => setIsResolutionOpen(false)}
          onResolved={handleResolveUnknown}
        />
      )}
    </div>
  );
}
