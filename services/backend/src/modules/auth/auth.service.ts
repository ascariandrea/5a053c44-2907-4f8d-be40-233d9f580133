import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthGQL } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AuthGQL | null> {
    const user = await this.userService.getUser({ username });
    if (!user) {
      return null;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (user && passwordValid) {
      await user.permissions.init();
      const payload = {
        username: user.username,
        sub: user.id,
        permissions: user.permissions.getItems().map((d) => d.permission),
      };

      return {
        ...payload,
        token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
      };
    }
    return null;
  }

  async validateUser(payload: any) {
    const user = await this.userService.getUser({
      id: payload.sub,
      username: payload.username,
    });

    if (!user) {
      throw new NotFoundException(`User does not exist`);
    }

    return user;
  }
}
