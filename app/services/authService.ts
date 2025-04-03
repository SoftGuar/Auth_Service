import { generateToken, verifyToken } from './jwtService';
import prisma from './prismaService';
import bcrypt from 'bcrypt';
import logger from '../utils/logger/logger';
import { InvalidRoleError } from '../errors/auth/InvalidRoleError';
import { UserNotFoundError } from '../errors/auth/UserNotFoundError';
import { InvalidCredentialsError } from '../errors/auth/InvalidCredentialsError';
import { TokenGenerationError } from '../errors/auth/TokenGenerationError';
import { TokenVerificationError } from '../errors/auth/TokenVerificationError';

export enum Role {
  User = 'user',
  Decider = 'decider',
  SuperAdmin = 'superAdmin',
  Admin = 'admin',
  Maintainer = 'maintainer',
  Helper = 'helper',
  Commercial = 'commercial',
}

export const authService = {
  async login(email: string, password: string, role: string): Promise<string> {
    logger.info({ email, role }, 'Login attempt started');

    let prismaRole;
    switch (role) {
      case Role.User:
        prismaRole = prisma.user;
        break;
      case Role.Decider:
        prismaRole = prisma.decider;
        break;
      case Role.SuperAdmin:
        prismaRole = prisma.superAdmin;
        break;
      case Role.Admin:
        prismaRole = prisma.admin;
        break;
      case Role.Maintainer:
        prismaRole = prisma.maintainer;
        break;
      case Role.Helper:
        prismaRole = prisma.helper;
        break;
      case Role.Commercial:
        prismaRole = prisma.commercial;
        break;
      default:
        throw new InvalidRoleError(role);
    }

    const user = await prismaRole.findUnique({ where: { email } });
    if (!user) {
      throw new UserNotFoundError(email, role);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    try {
      const token = generateToken({ userId: String(user.id), role });
      logger.info({ email, role, userId: user.id }, 'Token generated successfully');
      return token;
    } catch (err) {
      throw new TokenGenerationError(err);
    }
  },

  async verifyToken(token: string): Promise<{ userId: string; role: string }> {
    try {
      const decodedToken = verifyToken(token);
      if (!decodedToken) {
        throw new TokenVerificationError({ token });
      }
      logger.info({ token }, 'Token verified successfully');
      return decodedToken;
    } catch (err) {
      throw new TokenVerificationError(err);
    }
  },
};