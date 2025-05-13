import jwt from 'jsonwebtoken';
import { generateToken, verifyToken, TokenPayload } from '../services/jwtService';

describe('JWT Service', () => {
  const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
  const mockPayload: TokenPayload = { 
    userId: '123', 
    role: 'user' 
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);
      
      // Verify token can be decoded
      const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should use default expiration when not specified', () => {
      const token = generateToken(mockPayload);
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      
      expect(decoded.exp).toBeDefined();
    });

    it('should use custom expiration when provided', () => {
      const customExpiration = 1000; // 1000 seconds
      const token = generateToken(mockPayload, customExpiration);
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      
      expect(decoded.exp).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should successfully verify a valid token', () => {
      const token = generateToken(mockPayload);
      const verified = verifyToken(token);
      
      expect(verified).toEqual({
        userId: mockPayload.userId,
        role: mockPayload.role
      });
    });

    it('should return null for an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const verified = verifyToken(invalidToken);
      
      expect(verified).toBeNull();
    });

    it('should return null for an expired token', () => {
      const token = generateToken(mockPayload, 1); // Expire immediately
      
      // Wait a bit to ensure token is expired
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const verified = verifyToken(token);
          expect(verified).toBeNull();
          resolve();
        }, 2000);
      });
    });
  });
});