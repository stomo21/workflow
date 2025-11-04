import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ClerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient: ClerkClient;

  constructor() {
    this.clerkClient = new ClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const session = await this.clerkClient.verifyToken(token);
      request['user'] = session;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
