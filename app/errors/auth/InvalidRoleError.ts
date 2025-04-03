import { BaseError } from '../BaseError';

export class InvalidRoleError extends BaseError {
    constructor(role: string) {
      super(
        `Role "${role}" is not recognized.`,
        'INVALID_ROLE',
        400,
        { providedRole: role },
        'AuthService.validateRole',
        'Ensure you pass one of the valid roles (e.g., user, admin, etc.).'
      );
    }
  }




