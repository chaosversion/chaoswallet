import { SignJWT, jwtVerify } from 'jose';

import type { JWTAdapter, JWTToken } from './interfaces/jwt.adapter';
import { UnauthorizedError } from '@/errors/authorization-error';
import { env } from '@/env';

export class JoseJWTAdapter implements JWTAdapter {
  private readonly secret: Uint8Array = new TextEncoder().encode(
    env.TOKEN_SECRET
  );

  async verify(token: string): Promise<JWTToken> {
    try {
      const decoded = await jwtVerify<JWTToken>(token, this.secret, {
        issuer: 'https://chaosversion.com.br',
        audience: 'https://chaosversion.com.br'
      });

      return decoded.payload;
    } catch {
      throw new UnauthorizedError('The token is invalid.');
    }
  }
}
