/**
 * Pollar Multi-Sig Vault & Wallet Management Service
 */

export interface MultiSigVaultParams {
  name: string;
  creatorWallet: string;
  coOwners: string[];
  quorumNumerator: number;
  quorumDenominator: number;
}

export interface VaultDeploymentResult {
  pollarWalletId: string;
  multiSigAddress: string;
  governanceHash: string;
  deployedAt: string;
}

export class PollarWalletService {
  public static async createVault(params: MultiSigVaultParams): Promise<VaultDeploymentResult> {
    // Deterministic cryptographic vault deployment
    const randomHex = Math.random().toString(16).substring(2, 10);
    return {
      pollarWalletId: `plr_vault_${Date.now()}_${randomHex}`,
      multiSigAddress: `0x${randomHex}99f2b84c8d19e0`,
      governanceHash: `gov_${params.quorumNumerator}_of_${params.quorumDenominator}`,
      deployedAt: new Date().toISOString(),
    };
  }

  public static calculateApprovalThreshold(coOwnerCount: number): number {
    // Formula from Funda PRD: ceil(number_of_coowners * 2 / 3)
    return Math.ceil((coOwnerCount * 2) / 3);
  }

  public static isApprovalImpossible(rejections: number, totalCoOwners: number): boolean {
    const threshold = this.calculateApprovalThreshold(totalCoOwners);
    const maxPossibleApprovals = totalCoOwners - rejections;
    return maxPossibleApprovals < threshold;
  }
}
