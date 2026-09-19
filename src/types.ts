export type KycStatus = 'UNVERIFIED' | 'TIER_1_PENDING' | 'TIER_2_VERIFIED';

export type UserRole = 'CO_OWNER' | 'CONTRIBUTOR' | 'PENDING_DEPOSITOR';

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'FX_EXCHANGE'
  | 'INTERNAL_TRANSFER'
  | 'CONTRIBUTION_REFUND';

export type TransactionStatus =
  | 'PENDING'
  | 'EXECUTED'
  | 'REJECTED'
  | 'HELD_IN_ESCROW'
  | 'PROCESSING';

export type ApprovalDecision = 'APPROVED' | 'REJECTED';

export type PendingMemberStatus =
  | 'PENDING_REVIEW'
  | 'RESOLVED_CONTRIBUTOR'
  | 'RESOLVED_CO_OWNER'
  | 'REFUNDED_IGNORED';

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  kycStatus: KycStatus;
  avatarUrl?: string;
}

export interface Membership {
  id: string;
  accountId: string;
  userId: string;
  role: UserRole;
  notificationsEnabled: boolean;
  user?: User;
}

export interface JointAccount {
  id: string;
  name: string;
  pollarWalletId: string;
  createdBy: string;
  balance: number;
  currency: string;
  governanceRule: string;
  coOwnersCount: number;
  contributorsCount: number;
  lastActivity?: string;
  fundedThisCycle?: number;
  category?: 'ventures' | 'property' | 'community' | 'general';
}

export interface PendingMember {
  id: string;
  accountId: string;
  walletAddress: string;
  depositorName: string;
  bankSource: string;
  firstDepositAmount: number;
  status: PendingMemberStatus;
  remark?: string;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface Approval {
  id: string;
  transactionId?: string;
  membershipChangeId?: string;
  approverId: string;
  approverName: string;
  roleDescription: string;
  decision: ApprovalDecision;
  timestamp: string;
}

export interface Transaction {
  id: string;
  accountId?: string;
  accountName?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  remark: string;
  initiatedBy: string;
  initiatorName: string;
  recipient?: string;
  payoutRoute?: string;
  status: TransactionStatus;
  txHash: string;
  ledgerNumber?: number;
  merkleBlock?: number;
  createdAt: string;
  timeAgo?: string;
  approvals: Approval[];
  requiredSignatures: number;
  approvedSignatures: number;
  tag?: string;
  fxDetails?: {
    receivedAmount: number;
    receivedCurrency: string;
    rate: number;
  };
}

export interface PersonalWalletState {
  totalUsd: number;
  displayCurrency?: 'USD' | 'NGN';
  yieldActive: boolean;
  yieldPercent: number;
  holdings: {
    usd: number;
    ngn: number;
    eur: number;
    hkd?: number;
    gbp?: number;
  };
  guardrails: {
    autoTopupEnabled: boolean;
    autoTopupThreshold: number;
    autoTopupAmount: number;
    lastTopupDate: string;
    targetUsdReserveFloor: number;
  };
}

export interface NigerianBank {
  code: string;
  name: string;
  shortName: string;
  nipSupported: boolean;
}

export interface PollarSdkStatus {
  connected: boolean;
  environment: 'production' | 'sandbox' | 'testnet';
  publishableKey: string;
  nodeName: string;
  latencyMs: number;
  network: 'mainnet' | 'testnet';
  stellarActive: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'APPROVAL_NEEDED' | 'UNKNOWN_DEPOSIT' | 'EXECUTED' | 'INFO';
  isRead: boolean;
  timeAgo: string;
  linkRoute?: string;
}
