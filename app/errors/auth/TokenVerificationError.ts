import { BaseError } from '../BaseError';

export class TokenVerificationError extends BaseError {
    constructor(details?: any) {
      super(
        'Failed to verify token.',
        'TOKEN_VERIFICATION_ERROR',
        401,
        { ...details },
        'AuthService.verifyToken',
        'Ensure the token is valid and not expired.'
      );
    }
  }
