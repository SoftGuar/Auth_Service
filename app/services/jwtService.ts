import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION ? parseInt(process.env.JWT_EXPIRATION, 10) : 604800;

import logger from '../utils/logger/logger';
import { TokenGenerationError } from '../errors/auth/TokenGenerationError';
import { TokenVerificationError } from '../errors/auth/TokenVerificationError';


export interface TokenPayload {
  userId: string;
  role: string;
}


export function generateToken(payload: TokenPayload, expiresIn: number = JWT_EXPIRATION): string {
  try {
    const options: SignOptions = { expiresIn };
    const token = jwt.sign(payload, SECRET_KEY as jwt.Secret, options);
    logger.info({ payload }, 'Token generated successfully');
    return token;
  } catch (error) {
    logger.error({ error, payload }, 'Token generation failed');
    throw new TokenGenerationError({ payload, error });
  }
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload & JwtPayload;
    logger.info({ token }, 'Token verified successfully');
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    logger.error({ token, error }, 'Token verification failed');
    throw new TokenVerificationError({ token, error });
  }
}
