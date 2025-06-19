import type { JWTPayload as JoseJWTPayload } from 'jose';

export interface JWTToken extends JoseJWTPayload {
  sessionId: string;
  sub: string;
  name: string;
  email: string;
}

export interface JWTAdapter {
  verify(token: string): Promise<JWTToken>;
}
