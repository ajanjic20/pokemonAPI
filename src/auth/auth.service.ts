import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userService.getUser({ email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return false;
      return true;
    }
    return false;
  }

  async validateToken(token: string) {
    const secret = this.configService.get('JWT_SECRET');
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid Token');
    }
  }
}
