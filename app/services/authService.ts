// language: typescript
import { PrismaClient } from '@prisma/client';
import { generateToken,  verifyToken } from './jwtService';
import prisma from "./prismaService";
import bcrypt from 'bcrypt';

export enum Role {
    User = 'user',
    Decider = 'decider',
    SuperAdmin = 'superAdmin',
    Admin = 'admin',
    Maintainer = 'maintainer',
    Helper = 'helper',
    Commercial = 'commercial'
  }
export const authService = {
    
    async login(email: string, password: string, role: string): Promise<string | null> {
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
            return null;
        }

        const user = await prismaRole.findUnique({ where: { email } });
        if (!user) return null;
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;
        return generateToken({ userId: String(user.id), role: role });
      },

    async verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
        const decodedToken = await verifyToken(token);
        if (!decodedToken) return null;
        return decodedToken;
      }
};