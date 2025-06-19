import { db } from '@/db/drizzle';
import { wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Wallet, WalletRepository } from '../interfaces/wallet.repository';

declare module 'fastify' {
  interface FastifyInstance {
    walletRepository: WalletRepository;
  }
}

export class DrizzleWalletRepository implements WalletRepository {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  async create(userId: string): Promise<Wallet> {
    const [insertedWallet] = await this.db
      .insert(wallets)
      .values({
        userId,
        balance: 0
      })
      .returning();

    return insertedWallet;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1)
      .then(rows => rows[0] || null);

    return wallet;
  }

  async updateBalance(userId: string, amount: number): Promise<void> {
    await this.db
      .update(wallets)
      .set({ balance: amount })
      .where(eq(wallets.userId, userId));
  }
}
