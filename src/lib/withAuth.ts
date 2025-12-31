import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload;
}

export const withAuth = (handler: (req: AuthenticatedRequest, context: any) => Promise<NextResponse>, requiredRole?: string) => {
  return async (req: NextRequest, context: any) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (requiredRole && payload.role !== requiredRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    (req as AuthenticatedRequest).user = payload;
    return handler(req as AuthenticatedRequest, context);
  };
};