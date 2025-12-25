import { UserPayload } from '../../../../packages/shared-types/src/user.types';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
