/**
 * Pollar Multi-Sig Vault & Wallet Management Service
 * Strictly adheres to the Funda PRD governance formulas.
 */

import { PollarTransactionsService } from './transactions';

export interface MultiSigVaultParams {
  name: string;
  creatorWallet: string;
  coOwners: string[];
  initialBalance: number;
  currency: 'NGN' | 'USD';
  quorumNumerator: number;
  quorumDenominator: number;
}

export interface VaultDeploymentResult {
  pollarWalletId: string;
  multiSigAddress: string;
  governanceHash: string;
  deployedAt: string;
  currency: string;
  initialBalance: number;
}

export class PollarWalletService {
  public static async createVault(params: MultiSigVaultParams): Promise<VaultDeploymentResult> {
    const rawData = `vault-${params.name}-${params.currency}-${Date.now()}-${params.coOwners.join(',')}`;
    const fullHash = await PollarTransactionsService.computeSha256(rawData);
    const multiSigAddress = `0x${fullHash.slice(2, 42)}`;
    const pollarWalletId = `plr_vlt_${fullHash.slice(2, 14)}`;

    return {
      pollarWalletId,
      multiSigAddress,
      governanceHash: `gov_quorum_${params.quorumNumerator}_of_${params.quorumDenominator}`,
      deployedAt: new Date().toISOString(),
      currency: params.currency,
      initialBalance: params.initialBalance,
    };
  }

  /**
   * PRD mandate: ceil(number_of_coowners * 2 / 3)
   */
  public static calculateApprovalThreshold(coOwnerCount: number): number {
    return Math.ceil((coOwnerCount * 2) / 3);
  }

  /**
   * Checks if rejections prevent reaching the required 2/3 quorum
   */
  public static isApprovalImpossible(rejections: number, totalCoOwners: number): boolean {
    const threshold = this.calculateApprovalThreshold(totalCoOwners);
    const maxPossibleApprovals = totalCoOwners - rejections;
    return maxPossibleApprovals < threshold;
  }
}
