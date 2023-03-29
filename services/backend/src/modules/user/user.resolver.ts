import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  USER_ALL,
  USER_DEL,
  USER_WRITE,
  User,
} from '@weroad-test/models/lib/User';
import { UserEntity } from '../../entities';
import { AuthGQL } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/current-user.decorator.graphql';
import { GqlAuthGuard } from '../auth/gql-jwt-auth.guard';
import { CreateUserInput } from './create-user.input';
import { GetUsersArgs } from './get-users-filter.args';
import { LoginUserInput } from './login-user.input';
import { UserGQL } from './user.model';
import { UserService } from './user.service';
import { Permissions } from '../permissions/permission.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Resolver(() => UserGQL)
export class UserResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => UserGQL)
  @Permissions(USER_WRITE.value, USER_DEL.value, USER_ALL.value)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  async createUser(
    @Args('userData') userData: CreateUserInput,
  ): Promise<UserGQL> {
    const user = await this.userService.create(userData);

    return this.buildUserGQL(user);
  }

  @Mutation(() => AuthGQL, { nullable: true })
  async loginUser(
    @Args('loginData') loginData: LoginUserInput,
  ): Promise<AuthGQL | null> {
    const user = await this.authService.login(
      loginData.username,
      loginData.password,
    );
    if (!user) {
      throw new NotFoundException(`Cannot find user ${loginData.username}`);
    }
    return user;
  }

  @Query(() => UserGQL)
  @UseGuards(GqlAuthGuard)
  async getUser(@CurrentUser() user: User) {
    const u = await this.userService.getUser({ id: user.id });
    if (u) {
      return this.buildUserGQL(u);
    }
    return null;
  }

  @Query(() => [UserGQL])
  @UseGuards(GqlAuthGuard)
  async getUsers(@Args() filter: GetUsersArgs): Promise<UserGQL[]> {
    const users = await this.userService.getUsers(
      {
        ...(filter.username ? { username: filter.username } : {}),
      },
      { offset: filter.skip, limit: filter.take },
    );

    return users.map(this.buildUserGQL);
  }

  buildUserGQL(u: UserEntity): UserGQL {
    return {
      id: u.id,
      username: u.username,
      permissions: u.permissions.getItems().map((p) => p.permission),
    };
  }
}
