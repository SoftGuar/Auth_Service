import exampleRoutes from './example.routes';
import authRoutes from "./auth/auth.router"
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

const registerRoutes = (fastify: FastifyInstance) => {
  // Register example routes with a prefix
  fastify.register(exampleRoutes, { prefix: '/example' });

  // Register auth routes with a prefix
  fastify.register(authRoutes, { prefix: '/auth' });
  

};

export default registerRoutes;


