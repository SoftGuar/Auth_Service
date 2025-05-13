import { authService, Role } from '../services/authService';
import prisma from '../services/prismaService';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../services/jwtService';

// Mock dependencies
jest.mock('../services/prismaService', () => ({
  user: { findUnique: jest.fn() },
  decider: { findUnique: jest.fn() },
  superAdmin: { findUnique: jest.fn() },
  admin: { findUnique: jest.fn() },
  maintainer: { findUnique: jest.fn() },
  helper: { findUnique: jest.fn() },
  commercial: { findUnique: jest.fn() }
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

jest.mock('../services/jwtService', () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn()
}));

describe('Auth Service', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword'
  };

  const mockRoles = [
    Role.User, 
    Role.Decider, 
    Role.SuperAdmin, 
    Role.Admin, 
    Role.Maintainer, 
    Role.Helper, 
    Role.Commercial
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it.each(mockRoles)('should login successfully for %s role', async (role) => {
      // Setup mocks
      const prismaRoleModel = (prisma as any)[role];
      (prismaRoleModel.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      // Perform login
      const result = await authService.login(mockUser.email, 'password', role);

      // Assertions
      expect(prismaRoleModel.findUnique).toHaveBeenCalledWith({ 
        where: { email: mockUser.email } 
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
      expect(generateToken).toHaveBeenCalledWith({ 
        userId: String(mockUser.id), 
        role 
      });
      expect(result).toBe('mockToken');
    });

    it('should return null for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.login('nonexistent@example.com', 'password', Role.User);

      expect(result).toBeNull();
    });

    it('should return null for incorrect password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login(mockUser.email, 'wrongpassword', Role.User);

      expect(result).toBeNull();
    });

    it('should return null for invalid role', async () => {
      const result = await authService.login(mockUser.email, 'password', 'invalidRole');

      expect(result).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const mockDecodedToken = { 
        userId: '1', 
        role: Role.User 
      };
      (verifyToken as jest.Mock).mockReturnValue(mockDecodedToken);

      const result = await authService.verifyToken('validToken');

      expect(verifyToken).toHaveBeenCalledWith('validToken');
      expect(result).toEqual(mockDecodedToken);
    });

    it('should return null for an invalid token', async () => {
      (verifyToken as jest.Mock).mockReturnValue(null);

      const result = await authService.verifyToken('invalidToken');

      expect(result).toBeNull();
    });
  });
});