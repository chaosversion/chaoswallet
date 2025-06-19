import { fastifyCookie } from '@fastify/cookie';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifyRateLimit } from '@fastify/rate-limit';
import { fastify } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './errors/app-error';
import { healthCheckRoutes } from './routes/health.routes';
import { env } from './env';
import { DrizzleWalletRepository } from './repositories/drizzle/wallet.repository';
import { walletRoutes } from './routes/wallet.routes';
import { UnauthorizedError } from './errors/authorization-error';

export const app = fastify({
  logger: true
});

// Repositories
app.decorate('walletRepository', new DrizzleWalletRepository());

// Register plugins and routes
app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET
});

app.register(fastifyHelmet, {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' },
  frameguard: { action: 'deny' }
});

app.register(fastifyRateLimit, {
  global: true,
  max: env.NODE_ENV === 'development' ? 1000 : env.RATE_LIMIT_MAX,
  timeWindow: '1 minute',
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true
  }
});

// Register routes
app.register(walletRoutes, { prefix: '/wallet' });
app.register(healthCheckRoutes);

// Error handler
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      type: 'validation_error',
      issues: error.errors
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      type: 'application_error',
      message: error.message
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      type: 'unauthorized',
      message: error.message
    });
  }

  app.log.error(error, 'Unhandled error');
  return reply.status(500).send({
    type: 'internal_error',
    message: 'Internal server error'
  });
});
