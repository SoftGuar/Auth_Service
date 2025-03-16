import { FastifyInstance } from 'fastify';
import { login, verifyToken } from '../../handlers/authHandler';
import { loginSchema, verifyTokenSchema } from './auth.schema';

const authRoutes = async (fastify: FastifyInstance) => {
  // POST /login - Authenticate user and return a JWT token
  fastify.post('/login', { schema: loginSchema }, login);

  // GET /login/verify-token - Verify JWT token
  fastify.get('/verify-token', { schema: verifyTokenSchema }, verifyToken);
};

export default authRoutes;