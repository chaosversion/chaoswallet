import { env } from "@/env";
import { JoseJWTAdapter } from "@/lib/jwt.adapter";
import axios from "axios";
import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

const authApi = axios.create({
  baseURL: env.AUTH_API_URL,
});

const jwtAdapter = new JoseJWTAdapter();

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

export async function hasValidSessionCookie(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const sessionId = request.cookies.session_id;

  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized. Session ID is missing.",
    });
  }

  const res = await authApi.post<{
    valid: boolean;
  }>("/auth/validate", {
    sessionId,
  });

  const isValid = res.data.valid;

  if (!isValid) {
    return reply.status(401).send({
      error: "Unauthorized. Session is invalid or expired.",
    });
  }

  const decodedSession = await jwtAdapter.verify(sessionId);

  request.user = {
    id: decodedSession.sub,
    email: decodedSession.email,
    name: decodedSession.name,
  };

  done();
}
