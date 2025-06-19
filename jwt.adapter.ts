import type { JWTPayload as JoseJWTPayload } from 'jose';

// Used to create tokens
export interface JWTPayload {
  sessionId: string;
  sub: string;
  name: string;
  email: string;
  exp: Date; // Optional expiration date
}

// Decoded token payload
export interface JWTToken extends JoseJWTPayload {
  sessionId: string;
  sub: string;
  name: string;
  email: string;
}

// Used to create refresh tokens
export interface RefreshTokenPayload {
  sub: string;
  email: string;
  exp: Date;
}

// Decoded refresh token payload
export interface RefreshToken extends JWTPayload {
  sub: string;
  email: string;
}

export interface JWTAdapter {
  sign(payload: JWTPayload): Promise<string>;
  signRefreshToken(payload: RefreshTokenPayload): Promise<string>;
  verify(token: string): Promise<JWTToken>;
  verifyRefreshToken(token: string): Promise<RefreshToken>;
}
