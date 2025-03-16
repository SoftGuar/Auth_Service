import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? parseInt(process.env.JWT_EXPIRATION, 10) : 604800;

export interface TokenPayload {
  userId: string;
  role: string;
}


export function generateToken(payload: TokenPayload, expiresIn: number = JWT_EXPIRATION): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET_KEY as jwt.Secret, options);
}


export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload & JwtPayload;
    // Return only the TokenPayload properties
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    // Token invalid or expired
    return null;
  }
}
