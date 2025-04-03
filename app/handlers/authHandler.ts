import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/authService';

interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) => {
  const { email, password, role } = request.body;
  const authToken = await authService.login(email, password, role);
  return reply.code(200).send({
    success: true,
    data: { token: authToken },
  });
};

export const verifyToken = async (
  request: FastifyRequest<{ Headers: { authorization: string } }>,
  reply: FastifyReply
) => {
  const token = request.headers.authorization;
  if (!token) {
    return reply.code(401).send({
      success: false,
      message: 'Authorization header missing',
    });
  }
  const decodedToken = await authService.verifyToken(token);
  if (!decodedToken) {
    return reply.code(401).send({
      success: false,
      message: 'Invalid token',
    });
  }
  return reply.code(200).send({
    success: true,
    data: decodedToken,
  });
};
