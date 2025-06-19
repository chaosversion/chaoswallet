export interface Wallet {
  userId: string;
  balance: number;
}

export interface WalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  updateBalance(userId: string, amount: number): Promise<void>;
  create(userId: string): Promise<Wallet>;
}
