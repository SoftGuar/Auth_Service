import { BaseError } from '../BaseError';

export class InvalidCredentialsError extends BaseError {
    constructor() {
      super(
        'Invalid credentials provided.',
        'INVALID_CREDENTIALS',
        401,
        { hint: 'Check if the email and password combination is correct.' },
        'AuthService.authenticate',
        'Ensure you are using the correct login details.'
      );
    }
  }