import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@weroad-test/models/lib';
import * as fc from 'fast-check';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { EditTravelData } from '../src/modules/travel/edit-travel.input';
import * as request from 'supertest';
import { getConfig } from '../src/mikro-orm.config';
import { CreateTravelData } from '../src/modules/travel/create-travel.input';
import { TravelModule } from '../src/modules/travel/travel.module';
import { TravelService } from '../src/modules/travel/travel.service';
import { toJWTUser } from '../src/modules/user/user-jwt.utils';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import { CreateTravelBodyArb } from './arbitraries/travel.arbitrary';
import { CreateUserBodyArb } from './arbitraries/user.arbitrary';

describe('CRUD travels', () => {
  let app: INestApplication,
    travelService: TravelService,
    userService: UserService,
    tourPlanner: User.User,
    editor: User.User,
    admin: User.User;
  const travelIds: string[] = [];
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
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
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          path: 'graphql',
          playground: true,
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
        }),
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

    admin = await userService.create(adminData).then(userService.toUserIO);

    const editorData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      email: `editor-${u.email}`,
      permissions: [User.TRAVEL_ALL.value, User.TOUR_ALL.value],
    }))[0];

    // editorPassword = editorData.password;

    editor = await userService.create(editorData).then(userService.toUserIO);

    const tourPlannerData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      email: `tour-planner-${u.email}`,
      permissions: [User.TOUR_ALL.value],
    }))[0];

    // editorPassword = tourPlannerData.password;

    tourPlanner = await userService
      .create(tourPlannerData)
      .then(userService.toUserIO);

    const [travels] = await travelService.getTravels({}, { limit: 400 });

    await Promise.all(
      travels.map(async (t) => {
        await travelService.delete(t.id);
      }),
    );
  });

  afterEach(async () => {
    await Promise.all(travelIds.map((id) => travelService.delete(id as any)));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getTravels', () => {
    const getTravelsQuery = `
      query {
        getTravels {
          total
          edges { node { id } }

        }
      }
    `;

    it('should receive an empty list when no travels is inserted', async () => {
      const r = await request(app.getHttpServer()).post('/graphql').send({
        query: getTravelsQuery,
      });

      expect(r.status).toBe(200);
      expect(r.body).toMatchObject({
        data: { getTravels: { total: 0, edges: [] } },
      });
    });

    it('should receive a list with the item just created', async () => {
      const [data] = fc.sample(CreateTravelBodyArb);
      const travel = await travelService.create(data, admin.id);
      const r = await request(app.getHttpServer()).post('/graphql').send({
        query: getTravelsQuery,
      });

      expect(r.status).toBe(200);
      expect(r.body).toMatchObject({
        data: {
          getTravels: {
            total: 1,
            edges: [
              {
                node: { id: travel.id },
              },
            ],
          },
        },
      });

      travelIds.push(travel.id);
    });

    it('should receive a paginated list with the 20 items', async () => {
      const data = fc.sample(CreateTravelBodyArb, 50);
      const travels = await Promise.all(
        data.map((d) => travelService.create(d, admin.id)),
      );

      // travels.sort(
      //   (a, b) => a.updatedAt.getMilliseconds() - b.updatedAt.getMilliseconds(),
      // );

      // travels.reverse();

      // page one
      const r = await request(app.getHttpServer()).post('/graphql').send({
        query: getTravelsQuery,
      });

      expect(r.status).toBe(200);
      const pageOneIds = [...travels.slice(0, 20)].map((t) => t.id);
      expect(
        r.body.data.getTravels.edges.every((n: any) =>
          pageOneIds.includes(n.node.id),
        ),
      ).toBe(true);
      expect(r.body).toMatchObject({
        data: {
          getTravels: {
            total: 50,
          },
        },
      });

      // page two
      const r2 = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
        query {
          getTravels(skip: 20, take: 20) {
            total
            edges { node { id } }
          }
        }`,
        });

      expect(r2.status).toBe(200);
      expect(r2.body).toMatchObject({
        data: {
          getTravels: {
            total: 50,
            edges: travels.slice(20, 40).map((t) => ({ node: { id: t.id } })),
          },
        },
      });

      travelIds.push(...travels.map((t) => t.id));
    });
  });

  describe('createTravel', () => {
    const getMutationQuery = (travelData: CreateTravelData): string =>
      `
        mutation {
          createTravel(travelData: {
            name: "${travelData.name}"
            slug: "${travelData.slug}"
            description: "${travelData.description}"
            numberOfDays: ${travelData.numberOfDays}
            moods: {
              nature: ${travelData.moods.nature}
              relax: ${travelData.moods.relax}
              culture: ${travelData.moods.culture}
              history: ${travelData.moods.history}
              party: ${travelData.moods.party}
            }
          }) {
            id
            name
            description
          }
        }
        `;

    it('should receive an error when `Authorization` header is missing', async () => {
      const [travelData] = fc.sample(CreateTravelBodyArb, 1);
      const query = getMutationQuery(travelData);

      const r = await request(app.getHttpServer()).post('/graphql').send({
        query,
      });

      expect(r.status).toBe(200);
      expect(r.body.errors?.[0].message).toBe('Unauthorized');
    });

    it('should receive a 403 error when `Authorization` token has insufficient permissions', async () => {
      const authToken = jwt.sign(
        toJWTUser(tourPlanner),
        process.env.JWT_SECRET,
      );

      const [data] = fc.sample(CreateTravelBodyArb, 1);

      const query = getMutationQuery(data);

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query });

      expect(r.status).toBe(200);
      expect(r.body.errors[0]).toMatchObject({ message: 'Forbidden resource' });
    });

    it('should successfully create a travel when token has sufficient permissions', async () => {
      const authToken = jwt.sign(toJWTUser(editor), process.env.JWT_SECRET);

      const data = fc.sample(CreateTravelBodyArb, 1)[0];

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: getMutationQuery(data) });

      expect(r.status).toBe(200);
      expect(r.body.data).toMatchObject({ createTravel: { name: data.name } });

      travelIds.push(r.body.id);
    });
  });

  describe('getTravelBySlug', () => {
    const getTravelBySlugQuery = (slug: string) =>
      `
    query {
      getTravelBySlug(slug: "${slug}") {
        id
        name
        slug
        description
        numberOfDays
        moods {
          nature
          relax
          history
          culture
          party
        }
        creator {
          username
        }
      }
    }
    `;

    it('should return a 404 error when slug is not present', async () => {
      const authToken = jwt.sign(toJWTUser(editor), process.env.JWT_SECRET);
      const [data] = fc.sample(CreateTravelBodyArb, 1);
      const query = getTravelBySlugQuery(data.slug);
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query,
        });

      expect(r.status).toBe(200);
      expect(r.body.errors[0]).toMatchObject({
        message: `Cannot find travel with slug "${data.slug}"`,
      });
    });

    it('should return the correct travel by slug', async () => {
      const authToken = jwt.sign(toJWTUser(editor), process.env.JWT_SECRET);
      const [data] = fc.sample(CreateTravelBodyArb, 1);
      const query = getTravelBySlugQuery(data.slug);

      const travel = await travelService.create(data, editor.id);

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query,
        });

      expect(r.status).toBe(200);
      expect(r.body.data.getTravelBySlug).toMatchObject({
        ...data,
        creator: {
          username: editor.username,
        },
      });

      await travelService.delete(travel.id);
    });
  });

  describe('editTravel', () => {
    const editTravelQuery = (travelId: string, d: EditTravelData): string =>
      `
    mutation {
      editTravel(travelId: "${travelId}" travelData: {
        name: "${d.name}"
        slug: "${d.slug}"
        description: "${d.description}"
        numberOfDays: ${d.numberOfDays}
        moods: {
          nature: ${d.moods.nature}
          relax: ${d.moods.relax}
          culture: ${d.moods.culture}
          history: ${d.moods.history}
          party: ${d.moods.party}
        }
        userId: "${d.userId}"
      }) {
        id
        name
        slug
        description
        numberOfDays
        moods {
          nature
          relax
          culture
          history
          party
        }
        creator {
          username
        }
      }
    }
    `;

    it('should edit the event correctly', async () => {
      const token = jwt.sign(toJWTUser(admin), process.env.JWT_SECRET);
      const [data] = fc.sample(CreateTravelBodyArb, 1);

      const travel = await travelService.create(data, admin.id);
      const query = editTravelQuery(travel.id, { ...data, userId: editor.id });

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({ query });

      expect(r.status).toBe(200);
      expect(r.body.data.editTravel).toMatchObject({
        ...data,
        creator: {
          username: editor.username,
        },
      });
    });
  });
});
