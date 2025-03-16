// language: typescript
import { generateToken, verifyToken, TokenPayload } from '../services/jwtService';

describe('JWT Service', () => {
  const payload: TokenPayload = { userId: 'test-user', role: 'admin' };

  test('should generate a valid token', () => {
    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  test('should verify a valid token and return the correct payload', () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded).toMatchObject(payload);
  });

  test('should return null for an invalid token', () => {
    const invalidToken = 'invalid.token.string';
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });
});