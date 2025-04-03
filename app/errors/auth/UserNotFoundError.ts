import { BaseError } from '../BaseError';


export class UserNotFoundError extends BaseError {
    constructor(email: string, role: string) {
      super(
        `${role} with email "${email}" not found.`,
        'USER_NOT_FOUND',
        404,
        { email, role },
        'AuthService.findUser',
        'Verify the email address and role, and try again.'
      );
    }
  }