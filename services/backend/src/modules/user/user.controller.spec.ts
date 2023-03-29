import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserBody } from 'src/models/User';
import { UUID } from 'io-ts-types/lib/UUID';
import { AuthService } from 'modules/auth/auth.service';
import { getConfig } from '../../../mikro-orm.config';
import { UserEntity, UserPermissionEntity } from '../../entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController, userService: UserService;
  const userIds: UUID[] = [];

  beforeEach(async () => {
    // eslint-disable-next-line
    const config = getConfig();

    const app: TestingModule = await Test.createTestingModule({
      imports: [
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
      providers: [AuthService, UserService],
      controllers: [UserController],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
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
      const newUser = await userController.createUser(data);

      expect(newUser).not.toHaveProperty('password');
      expect(newUser).toMatchObject({
        username: data.username,
        permissions: data.permissions,
      });

      userIds.push(newUser.id);
    });
  });
});
