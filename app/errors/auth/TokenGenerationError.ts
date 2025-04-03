import { BaseError } from '../BaseError';


export class TokenGenerationError extends BaseError {
    constructor(details?: any) {
      super(
        'Failed to generate token.',
        'TOKEN_GENERATION_ERROR',
        500,
        { ...details },
        'AuthService.generateToken',
        'Check your JWT configuration and try again.'
      );
    }
  }


