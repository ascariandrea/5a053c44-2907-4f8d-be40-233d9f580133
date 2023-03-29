import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as fc from 'fast-check';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { v4 } from 'uuid';
import { getConfig } from '../mikro-orm.config';
import { User } from '../src/models';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import { CreateUserBodyArb } from './arbitraries/user.abitrary';

describe('CRUD /users', () => {
  let app: INestApplication,
    userService: UserService,
    editor: User.User,
    editorPassword: string,
    admin: User.User,
    adminPassword: string;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        // ConfigModule.forRoot({
        //   envFilePath: path.resolve(process.cwd(), '.env.test'),
        // }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '120s',
          },
        }),
        MikroOrmModule.forRoot({
          ...getConfig(),
          allowGlobalContext: true,
        }),
        UserModule,
      ],
    }).compile();

    app = module.createNestApplication();
    userService = app.get(UserService);
    await app.init();

    const adminData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      permissions: [
        User.TRAVEL_ALL.value,
        User.TOUR_ALL.value,
        User.USER_ALL.value,
      ],
    }))[0];

    adminPassword = adminData.password;

    admin = await userService.create(adminData).then(userService.toUserIO);

    const editorData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      permissions: [User.TRAVEL_ALL.value, User.TOUR_ALL.value],
    }))[0];

    editorPassword = editorData.password;

    editor = await userService.create(editorData).then(userService.toUserIO);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/login', () => {
    it('should receive a 404 error when `username` is not found', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          username: admin.username + '-wrong',
          password: adminPassword,
        })
        .expect(404);
    });

    it('should receive a 404 error when `password` mismatch', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          username: admin.username,
          password: editorPassword,
        })
        .expect(404);
    });

    it('should receive a 200 error when `username` and `password`  match', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          username: admin.username,
          password: adminPassword,
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          username: editor.username,
          password: editorPassword,
        })
        .expect(201);
    });
  });
  describe('/', () => {
    it('should receive a 401 error when no `Authorization` header is missing', async () => {
      const r = await request(app.getHttpServer()).post('/users').send({});

      expect(r.status).toBe(401);
    });

    it('should receive a 404 when `Authorization` token contains an invalid user id', async () => {
      const authToken = jwt.sign(
        { ...editor, id: v4() },
        process.env.JWT_SECRET,
      );
      const data = fc.sample(CreateUserBodyArb, 1)[0];
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Token ${authToken}`)
        .send(data)
        .expect(404);
    });

    it('should receive a 403 error when `Authorization` token has insufficient permissions', async () => {
      const authToken = jwt.sign(editor, process.env.JWT_SECRET);

      const data = fc.sample(CreateUserBodyArb, 1)[0];

      const r = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Token ${authToken}`)
        .send(data)
        .expect(403);

      expect(r.body).toMatchObject({ message: 'Forbidden resource' });
    });

    it('should create an "editor" user from an "admin" user', async () => {
      const authToken = jwt.sign(admin, process.env.JWT_SECRET);

      const data = fc.sample(CreateUserBodyArb, 1).map((u) => ({
        ...u,
        permissions: [User.TRAVEL_ALL.value, User.TOUR_ALL.value],
      }))[0];

      const r = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Token ${authToken}`)
        .send(data)
        .expect(201);

      expect(r.body).toHaveProperty('id');
      expect(r.body).toHaveProperty('createdAt');
      expect(r.body).toHaveProperty('updatedAt');
      expect(r.body).toMatchObject({
        email: data.email,
        username: data.username,
        permissions: data.permissions,
      });
    });
  });
});
