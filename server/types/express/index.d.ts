/**
 * Extends Express Request with authenticated user context set by auth middleware.
 */
declare global {
  namespace Express {
    interface Request {
      /** Set by JWT auth middleware after token verification */
      user?: {
        id: string;
        isAdmin?: boolean;
      };
    }
  }
}

export {};
