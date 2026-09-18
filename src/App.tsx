import React, { useState } from 'react';
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
import {
  INITIAL_JOINT_ACCOUNTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PERSONAL_WALLET,
  INITIAL_TRANSACTIONS,
} from './data/mockStore';
import { JointAccount, Transaction } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [jointAccounts, setJointAccounts] = useState<JointAccount[]>(INITIAL_JOINT_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [personalWallet, setPersonalWallet] = useState(INITIAL_PERSONAL_WALLET);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Modals state
  const [merkleModal, setMerkleModal] = useState<{ open: boolean; txHash?: string }>({
    open: false,
  });
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);
  const [isResolutionOpen, setIsResolutionOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    headerTitle = 'Vault Multi Sig Detail';
    showBack = true;
  } else if (currentRoute === 'ledger') {
    headerTitle = 'Auditable Ledger';
    showBack = true;
  } else if (currentRoute === 'wallet') {
    headerTitle = 'Personal Wallet';
    showBack = true;
  } else if (currentRoute === 'wallet/fund') {
    headerTitle = 'Deposit Funds';
    showBack = true;
  } else if (currentRoute === 'wallet/exchange') {
    headerTitle = 'FX Exchange';
    showBack = true;
  } else if (currentRoute === 'wallet/cash-out') {
    headerTitle = 'Cash Out';
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

  // Action callbacks
  const handleDepositSuccess = (amount: number) => {
    setPersonalWallet((prev) => ({
      ...prev,
      totalUsd: prev.totalUsd + amount,
      holdings: {
        ...prev.holdings,
        usd: prev.holdings.usd + amount,
      },
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'DEPOSIT',
      amount,
      currency: 'USD',
      remark: 'Pollar Fast Wire Bank Deposit',
      initiatedBy: 'usr_alex_vance',
      initiatorName: 'Alex Vance',
      status: 'EXECUTED',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: 'Just now',
      timeAgo: 'Just now',
      requiredSignatures: 0,
      approvedSignatures: 0,
      approvals: [],
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Successfully deposited $${amount.toLocaleString()} USD via Pollar Fast Wire`);
    setCurrentRoute('home');
  };

  const handleFxSuccess = (usdSpent: number, hkdGained: number) => {
    setPersonalWallet((prev) => ({
      ...prev,
      holdings: {
        ...prev.holdings,
        usd: Math.max(prev.holdings.usd - usdSpent, 0),
        hkd: prev.holdings.hkd + hkdGained,
      },
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'FX_EXCHANGE',
      amount: usdSpent,
      currency: 'USD',
      remark: `Guaranteed FX Conversion to HKD @ 7.8214`,
      initiatedBy: 'usr_alex_vance',
      initiatorName: 'Alex Vance',
      status: 'EXECUTED',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: 'Just now',
      timeAgo: 'Just now',
      requiredSignatures: 0,
      approvedSignatures: 0,
      approvals: [],
      fxDetails: {
        receivedAmount: hkdGained,
        receivedCurrency: 'HKD',
        rate: 7.8214,
      },
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Converted $${usdSpent.toLocaleString()} USD into +HK$ ${hkdGained.toLocaleString()}`);
    setCurrentRoute('home');
  };

  const handleCashOutSuccess = (amount: number, bankDest: string) => {
    setPersonalWallet((prev) => ({
      ...prev,
      totalUsd: Math.max(prev.totalUsd - amount, 0),
      holdings: {
        ...prev.holdings,
        usd: Math.max(prev.holdings.usd - amount, 0),
      },
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'WITHDRAWAL',
      amount,
      currency: 'USD',
      remark: `Off-Ramp Transfer to ${bankDest}`,
      initiatedBy: 'usr_alex_vance',
      initiatorName: 'Alex Vance',
      payoutRoute: bankDest,
      status: 'EXECUTED',
      txHash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: 'Just now',
      timeAgo: 'Just now',
      requiredSignatures: 0,
      approvedSignatures: 0,
      approvals: [],
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Dispatched $${amount.toLocaleString()} USD to ${bankDest}`);
    setCurrentRoute('home');
  };

  const handleCreateVault = (newAccountData: Partial<JointAccount>) => {
    const newVault: JointAccount = {
      id: `vault_${Date.now()}`,
      name: newAccountData.name || 'New Joint Vault',
      pollarWalletId: `plr_vault_${Date.now()}`,
      createdBy: 'usr_alex_vance',
      balance: newAccountData.balance || 1000.0,
      currency: 'USD',
      governanceRule: 'Multi-Sig 2/3',
      coOwnersCount: 2,
      contributorsCount: 1,
      category: newAccountData.category || 'ventures',
    };
    setJointAccounts((prev) => [newVault, ...prev]);
    showToast(`Deployed new vault "${newVault.name}" on Pollar Core`);
  };

  const handleResolveUnknown = (role: 'CONTRIBUTOR' | 'CO_OWNER', memoText: string) => {
    showToast(`Admitted David O. Miller as ${role === 'CO_OWNER' ? 'Co-Owner' : 'Contributor'}`);
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
        notifications={notifications}
        onSelectNotification={(route) => setCurrentRoute(route)}
        onNavigateProfile={() => setCurrentRoute('wallet')}
      />

      {/* Main Responsive View Container (Max-w-md matching the mobile app screens) */}
      <main className="w-full max-w-md px-4 pt-20 pb-20 flex-1 flex flex-col">
        {currentRoute === 'home' && (
          <HomeView
            jointAccounts={jointAccounts}
            onNavigate={(route) => setCurrentRoute(route)}
            onOpenVault={() => setCurrentRoute('vault-detail')}
            onOpenWithdrawalReview={() => setCurrentRoute('vault-detail')}
          />
        )}

        {currentRoute === 'joint' && (
          <JointAccountsView
            jointAccounts={jointAccounts}
            onOpenVault={() => setCurrentRoute('vault-detail')}
            onOpenWithdrawalReview={() => setCurrentRoute('vault-detail')}
            onOpenLedgerAudit={() => setCurrentRoute('ledger')}
            onOpenCreateModal={() => setIsCreateVaultOpen(true)}
            onDepositJoint={() => setCurrentRoute('wallet/fund')}
          />
        )}

        {currentRoute === 'vault-detail' && (
          <VaultDetailView
            onBack={handleBack}
            onViewLedger={() => setCurrentRoute('ledger')}
          />
        )}

        {currentRoute === 'ledger' && (
          <AuditableLedgerView
            transactions={transactions}
            onOpenMerkleProof={(hash) => setMerkleModal({ open: true, txHash: hash })}
            onOpenDepositResolution={() => setIsResolutionOpen(true)}
          />
        )}

        {currentRoute === 'wallet' && (
          <PersonalWalletView
            walletState={personalWallet}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        )}

        {currentRoute === 'wallet/fund' && (
          <DepositFundsView
            onBack={handleBack}
            onSuccess={handleDepositSuccess}
          />
        )}

        {currentRoute === 'wallet/exchange' && (
          <FxExchangeView
            onBack={handleBack}
            onSuccess={handleFxSuccess}
          />
        )}

        {currentRoute === 'wallet/cash-out' && (
          <CashOutView
            onBack={handleBack}
            onSuccess={handleCashOutSuccess}
          />
        )}

        {currentRoute === 'activity' && (
          <ActivityView
            transactions={transactions}
            onOpenMerkleProof={(hash) => setMerkleModal({ open: true, txHash: hash })}
          />
        )}
      </main>

      {/* Persistent Bottom Nav Bar */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Merkle Proof Bottom Sheet Modal */}
      {merkleModal.open && (
        <MerkleProofModal
          txHash={merkleModal.txHash}
          onClose={() => setMerkleModal({ open: false })}
        />
      )}

      {/* Create Joint Account Modal */}
      {isCreateVaultOpen && (
        <CreateJointAccountModal
          onClose={() => setIsCreateVaultOpen(false)}
          onCreate={handleCreateVault}
        />
      )}

      {/* Unknown Depositor Resolution Modal */}
      {isResolutionOpen && (
        <DepositResolutionModal
          onClose={() => setIsResolutionOpen(false)}
          onResolved={handleResolveUnknown}
        />
      )}
    </div>
  );
}
