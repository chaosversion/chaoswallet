import type { FastifyInstance } from "fastify";
import { hasValidSessionCookie } from "@/middleware/has-valid-session-cookie.middleware";

export async function walletRoutes(app: FastifyInstance) {
  const walletRepository = app.walletRepository;

  // Create wallet
  app.post("/", { preHandler: hasValidSessionCookie }, async (req, res) => {
    const userId = req.user.id;

    const wallet = await walletRepository.create(userId);

    return res.status(201).send(wallet);
  });

  // Get wallet
  app.get("/", { preHandler: hasValidSessionCookie }, async (req, res) => {
    const userId = req.user.id;

    const wallet = await walletRepository.findByUserId(userId);

    if (!wallet) {
      return res.status(404).send({
        error: "Wallet not found",
      });
    }

    return wallet;
  });
}
