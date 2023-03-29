import { MikroOrmModule } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '../src/models';
import * as fc from 'fast-check';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { getConfig } from '../mikro-orm.config';
import { TravelModule } from '../src/modules/travel/travel.module';
import { TravelService } from '../src/modules/travel/travel.service';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import { CreateTravelBodyArb } from './arbitraries/travel.arbitrary';
import { CreateUserBodyArb } from './arbitraries/user.abitrary';

describe('CRUD /travels', () => {
  let app: INestApplication,
    travelService: TravelService,
    userService: UserService,
    tourPlanner: User.User,
    tourPlannerPassword: string,
    editor: User.User,
    editorPassword: string,
    admin: User.User,
    adminPassword: string;
  const travelIds: string[] = [];
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
        TravelModule,
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    travelService = app.get(TravelService);
    userService = app.get(UserService);

    const adminData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      email: `admin-${u.email}`,
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
      email: `editor-${u.email}`,
      permissions: [User.TRAVEL_ALL.value, User.TOUR_ALL.value],
    }))[0];

    editorPassword = editorData.password;

    editor = await userService.create(editorData).then(userService.toUserIO);

    const tourPlannerData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      email: `tour-planner-${u.email}`,
      permissions: [User.TOUR_ALL.value],
    }))[0];

    editorPassword = tourPlannerData.password;

    tourPlanner = await userService
      .create(tourPlannerData)
      .then(userService.toUserIO);
  });

  afterEach(async () => {
    await Promise.all(travelIds.map((id) => travelService.delete(id as any)));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /travels', () => {
    it('should receive an empty list when no travels is inserted', async () => {
      const r = await request(app.getHttpServer()).get('/travels').expect(200);

      expect(r.body).toMatchObject({ count: 0, data: [] });
    });

    it('should receive a list with the item just created', async () => {
      const [data] = fc.sample(CreateTravelBodyArb);
      const travel = await travelService.create(data, admin.id);
      const r = await request(app.getHttpServer()).get('/travels').expect(200);

      expect(r.body).toMatchObject({
        count: 1,
        data: [
          {
            name: data.name,
          },
        ],
      });

      travelIds.push(travel.id);
    });

    it('should receive a paginated list with the 20 items', async () => {
      const data = fc.sample(CreateTravelBodyArb, 50);
      const travels = await Promise.all(
        data.map((d) => travelService.create(d, admin.id)),
      );
      const r = await request(app.getHttpServer()).get('/travels').expect(200);

      expect(r.body.data.length).toBe(20);
      expect(r.body.count).toBe(50);

      travelIds.push(...travels.map((t) => t.id));
    });
  });

  describe('POST /travels', () => {
    it('should receive a 401 error when no `Authorization` header is missing', async () => {
      const r = await request(app.getHttpServer()).post('/travels').send({});

      expect(r.status).toBe(401);
    });

    it('should receive a 403 error when `Authorization` token has insufficient permissions', async () => {
      const authToken = jwt.sign(tourPlanner, process.env.JWT_SECRET);

      const data = fc.sample(CreateUserBodyArb, 1)[0];

      const r = await request(app.getHttpServer())
        .post('/travels')
        .set('Authorization', `Token ${authToken}`)
        .send(data)
        .expect(403);

      expect(r.body).toMatchObject({ message: 'Forbidden resource' });
    });

    it('should receive a 201 when `Authorization` token has sufficient permissions', async () => {
      const authToken = jwt.sign(editor, process.env.JWT_SECRET);

      const data = fc.sample(CreateTravelBodyArb, 1)[0];

      const r = await request(app.getHttpServer())
        .post('/travels')
        .set('Authorization', `Token ${authToken}`)
        .send(data)
        .expect(201);

      expect(r.body).toMatchObject(data);

      travelIds.push(r.body.id);
    });
  });
});
