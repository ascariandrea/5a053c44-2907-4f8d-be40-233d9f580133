import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { AuthGQL } from '../auth/auth.model';
import { LoginUserInput } from './login-user.input';
import { UserGQL } from './user.model';
import { UserService } from './user.service';

@Resolver(() => UserGQL)
export class UserResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => AuthGQL)
  async loginUser(
    @Args('loginData') loginData: LoginUserInput,
  ): Promise<AuthGQL> {
    const result = await this.authService.validateUser(
      loginData.username,
      loginData.password,
    );

    if (result) {
      const { accessToken } = await this.authService.login(result);
      return {
        sub: result.id,
        token: accessToken,
        permissions: result.permissions.getItems().map((p) => p.permission),
      };
    }
    throw new NotFoundException(`Can't find user ${loginData.username}`);
  }
}
