import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserBody } from '@weroad-test/models/lib/User';
import { UUID } from 'io-ts-types/lib/UUID';
import { AuthService } from '../auth/auth.service';
import { getConfig } from '../../mikro-orm.config';
import { UserEntity, UserPermissionEntity } from '../../entities';
import { UserService } from './user.service';
import { ConfigModule } from '../config/config.module';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let userResolver: UserResolver, userService: UserService, app: TestingModule;
  const userIds: UUID[] = [];

  beforeAll(async () => {
    // eslint-disable-next-line
    const config = getConfig();

    app = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MikroOrmModule.forRoot({
          ...config,
          allowGlobalContext: true,
        }),
        MikroOrmModule.forFeature({
          entities: [UserEntity, UserPermissionEntity],
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
        }),
      ],
      providers: [AuthService, UserService, UserResolver],
      controllers: [],
    }).compile();

    userResolver = app.get<UserResolver>(UserResolver);
    userService = app.get<UserService>(UserService);

    const user = await userService.getUser({ email: 'mail@weroad.it' });
    if (user) {
      await userService.delete(user.id);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createUser', () => {
    afterEach(async () => {
      await Promise.all(
        userIds.map(async (id) => {
          await userService.delete(id);
        }),
      );
    });

    it('should return create an "admin" user', async () => {
      const data: CreateUserBody = {
        email: 'mail@weroad.it',
        username: 'user name',
        password: 'user password',
        permissions: ['travel:*', 'tour:*', 'user:*'],
      };

      const newUser = await userResolver.createUser(data);

      expect(newUser).not.toHaveProperty('password');
      expect(newUser).toMatchObject({
        username: data.username,
        permissions: data.permissions,
      });

      userIds.push(newUser.id);
    });
  });
});
