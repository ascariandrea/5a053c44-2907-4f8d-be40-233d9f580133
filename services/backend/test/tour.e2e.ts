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
import { CreateTourData } from '../src/modules/tour/create-tour.input';
import { GetToursArgs } from '../src/modules/tour/get-tours.args';
import * as request from 'supertest';
import { getConfig } from '../src/mikro-orm.config';
import { TourModule } from '../src/modules/tour/tour.module';
import { TourService } from '../src/modules/tour/tour.service';
import { TravelModule } from '../src/modules/travel/travel.module';
import { TravelService } from '../src/modules/travel/travel.service';
import { toJWTUser } from '../src/modules/user/user-jwt.utils';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/modules/user/user.service';
import { CreateTourBodyArb } from './arbitraries/tour.arbitrary';
import { CreateTravelBodyArb } from './arbitraries/travel.arbitrary';
import { CreateUserBodyArb } from './arbitraries/user.arbitrary';

describe('CRUD tours', () => {
  let app: INestApplication,
    tourService: TourService,
    travelService: TravelService,
    userService: UserService,
    tourPlanner: User.User,
    admin: User.User;
  const travelIds: string[] = [],
    tourIds: string[] = [];
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
        TourModule,
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
    tourService = app.get(TourService);

    const adminData = fc.sample(CreateUserBodyArb, 1).map((u) => ({
      ...u,
      email: `admin-${u.email}`,
      permissions: [
        User.TRAVEL_ALL.value,
        User.TOUR_ALL.value,
        User.USER_ALL.value,
      ],
    }))[0];

    // adminPassword = adminData.password;

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
  });

  afterEach(async () => {
    await Promise.all(tourIds.map((id) => tourService.delete(id as any)));
    await Promise.all(travelIds.map((id) => travelService.delete(id as any)));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getTours', () => {
    const getToursQuery = ({ travelId, skip, take }: GetToursArgs) => `
      query {
        getTours(travelId: "${travelId}" skip: ${skip}, take: ${take}) {
          total
          edges {
            node {
              id
              name
              price
              startingDate
              endingDate
            }
          }

        }
      }
    `;

    it('should receive an empty list when no tour is present', async () => {
      const [data] = fc.sample(CreateTravelBodyArb, 1);
      const travel = await travelService.create({ ...data }, admin.id);

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getToursQuery({
            travelId: travel.id as any,
            skip: 0,
            take: 0,
          }),
        });

      expect(r.status).toBe(200);
      expect(r.body).toMatchObject({
        data: { getTours: { total: 0, edges: [] } },
      });
    });

    it('should receive a list with the item just created', async () => {
      const [data] = fc.sample(CreateTravelBodyArb, 1);
      const travel = await travelService.create(data, admin.id);
      const toursData = fc.sample(
        CreateTourBodyArb({
          travelId: travel.id,
        }),
        2,
      );

      const tours = await Promise.all(
        toursData.map((t) => tourService.create(t)),
      ).then((tours) => tours.reverse());

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getToursQuery({ travelId: travel.id, skip: 0, take: 20 }),
        });

      expect(r.status).toBe(200);
      expect(r.body).toMatchObject({
        data: {
          getTours: {
            total: 2,
            edges: toursData.map((d) => ({ node: { name: d.name } })),
          },
        },
      });

      travelIds.push(travel.id);
      tourIds.push(...tours.map((t) => t.id));
    });

    it('should receive a paginated list with the 20 items', async () => {
      const [data] = fc.sample(CreateTravelBodyArb, 1);
      const travel = await travelService.create(data, admin.id);
      const toursData = fc.sample(
        CreateTourBodyArb({ travelId: travel.id }),
        50,
      );

      const tours = await Promise.all(
        toursData.map((t) => tourService.create(t)),
      ).then((tours) => {
        return tours;
      });

      // page one
      const r = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getToursQuery({ travelId: travel.id, skip: 0, take: 20 }),
        });

      expect(r.status).toBe(200);
      const pageOneIds = [...tours.slice(0, 20)].map((t) => t.id);
      expect(
        r.body.data.getTours.edges.every((n: any) =>
          pageOneIds.includes(n.node.id),
        ),
      ).toBe(true);
      expect(r.body).toMatchObject({
        data: {
          getTours: {
            total: 50,
          },
        },
      });

      // page two
      const r2 = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getToursQuery({ travelId: travel.id, skip: 20, take: 20 }),
        });

      expect(r2.status).toBe(200);
      expect(r2.body).toMatchObject({
        data: {
          getTours: {
            total: 50,
            edges: tours.slice(20, 40).map((t) => ({ node: { id: t.id } })),
          },
        },
      });

      travelIds.push(travel.id);
      tourIds.push(...tours.map((t) => t.id));
    });
  });

  describe('createTour', () => {
    const getMutationQuery = (tourData: CreateTourData): string =>
      `
        mutation {
          createTour(tourData: {
            travelId: "${tourData.travelId}"
            name: "${tourData.name}"
            price: ${tourData.price}
            startingDate: "${tourData.startingDate.toISOString()}"
          }) {
            id
            name
            price
            startingDate
            endingDate
          }
        }
        `;

    it('should receive an error when `Authorization` header is missing', async () => {
      const [travelData] = fc.sample(CreateTravelBodyArb, 1);
      const travel = await travelService.create(travelData, admin.id);
      const [tourData] = fc.sample(
        CreateTourBodyArb({ travelId: travel.id }),
        1,
      );
      const query = getMutationQuery(tourData);

      const r = await request(app.getHttpServer()).post('/graphql').send({
        query,
      });

      expect(r.status).toBe(200);
      expect(r.body.errors?.[0].message).toBe('Unauthorized');
    });

    it('should successfully create a travel when token has sufficient permissions', async () => {
      const authToken = jwt.sign(
        toJWTUser(tourPlanner),
        process.env.JWT_SECRET,
      );

      const [travelData] = fc.sample(CreateTravelBodyArb, 1);
      const travel = await travelService.create(travelData, admin.id);
      const [tourData] = fc.sample(
        CreateTourBodyArb({ travelId: travel.id }),
        1,
      );
      const query = getMutationQuery(tourData);

      const r = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query });

      expect(r.status).toBe(200);
      expect(r.body.data).toMatchObject({
        createTour: { name: tourData.name },
      });

      travelIds.push(travel.id);
      tourIds.push(r.body.data.createTour.id);
    });
  });
});
