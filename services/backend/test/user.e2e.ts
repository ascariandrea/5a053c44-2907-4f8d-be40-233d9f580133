import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { User } from '@weroad-test/models/lib';
import { CreateUserBody } from '@weroad-test/models/src/User';
import * as fc from 'fast-check';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as request from 'supertest';
import { v4 } from 'uuid';
import { getConfig } from '../src/mikro-orm.config';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import { CreateUserBodyArb } from './arbitraries/user.arbitrary';

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
        MikroOrmModule.forRoot({
          ...getConfig(),
          allowGlobalContext: true,
        }),
        UserModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          path: 'graphql',
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
        }),
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

  describe('loginUser', () => {
    const getLoginQuery = (username: string, password: string) => `
    mutation {
      loginUser(loginData: { 
        username: "${username}" 
        password: "${password}"
      }) {
        token
        sub
        permissions
      }
    }`;

    it('should receive a 404 error when `username` is not found', async () => {
      const query = getLoginQuery(admin.username + '-wrong', adminPassword);

      const r = await request(app.getHttpServer()).post('/graphql').send({
        query,
      });

      expect(r.status).toBe(200);
      expect(r.body.errors[0]).toMatchObject({
        message: `Cannot find user ${admin.username}-wrong`,
      });
    });

    it('should receive a 404 error when `password` mismatch', async () => {
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getLoginQuery(admin.username, editorPassword),
        });

      expect(r.status).toBe(200);
      expect(r.body.errors[0]).toMatchObject({
        message: `Cannot find user ${admin.username}`,
      });
    });

    it('should receive a 200 error when `username` and `password`  match', async () => {
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getLoginQuery(admin.username, adminPassword),
        });

      expect(r.status).toBe(200);
      expect(r.body.data).toMatchObject({
        loginUser: {
          sub: admin.id,
          permissions: admin.permissions,
          token: expect.any(String),
        },
      });

      const r2 = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getLoginQuery(editor.username, editorPassword),
        })
        .expect(200);

      expect(r2.body.data).toMatchObject({
        loginUser: {
          sub: editor.id,
          permissions: editor.permissions,
          token: expect.any(String),
        },
      });
    });
  });

  describe('createUser', () => {
    const getCreateUserQuery = (u: CreateUserBody) => `
      mutation {
        createUser(userData: {
          username: "${u.username}"
          email: "${u.email}"
          password: "${u.password}"
          permissions: [${u.permissions.map((p) => `"${p}"`)}],
        }) {
          id
          username
          permissions
        }
      }
    `;

    it('should receive a 401 error when `Authorization` header is missing', async () => {
      const [data] = fc.sample(CreateUserBodyArb, 1);
      const query = getCreateUserQuery(data);

      const r = await request(app.getHttpServer()).post('/graphql').send({
        query,
      });

      expect(r.status).toBe(200);
      expect(r.body.errors[0]).toMatchObject({ message: `Unauthorized` });
    });

    it('should receive a 404 when `Authorization` token contains an invalid user id', async () => {
      const authToken = jwt.sign(
        { sub: v4(), username: admin.username, permissions: admin.permissions },
        process.env.JWT_SECRET,
      );
      const data = fc.sample(CreateUserBodyArb, 1)[0];
      const query = getCreateUserQuery(data);
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query });

      expect(r.status).toBe(200);
      expect(r.body.errors[0]).toMatchObject({
        message: `User does not exist`,
      });
    });

    it('should receive a 403 error when `Authorization` token has insufficient permissions', async () => {
      const authToken = jwt.sign(
        {
          sub: editor.id,
          username: editor.username,
          permissions: editor.permissions,
        },
        process.env.JWT_SECRET,
      );

      const data = fc.sample(CreateUserBodyArb, 1)[0];

      const query = getCreateUserQuery(data);
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query })
        .expect(200);

      expect(r.body.errors[0]).toMatchObject({ message: 'Forbidden resource' });
    });

    it('should create an "editor" user from an "admin" user', async () => {
      const authToken = jwt.sign(
        {
          sub: admin.id,
          username: admin.username,
          permissions: admin.permissions,
        },
        process.env.JWT_SECRET,
      );

      const data = fc.sample(CreateUserBodyArb, 1).map((u) => ({
        ...u,
        permissions: [User.TRAVEL_ALL.value, User.TOUR_ALL.value],
      }))[0];

      const query = getCreateUserQuery(data);
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query })
        .expect(200);

      expect(r.body.errors).toBe(undefined);
      expect(r.body.data.createUser).toMatchObject({
        username: data.username,
        permissions: data.permissions,
      });
    });
  });
});
