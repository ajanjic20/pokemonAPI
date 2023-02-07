import { Injectable, Inject } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExtendedRequestType } from './auth.types';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async use(req: ExtendedRequestType, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = await this.authService.validateToken(token);

      req.user = decoded['email'];
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or Expired Token' });
    }
  }
}
