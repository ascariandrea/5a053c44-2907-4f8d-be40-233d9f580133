import { MikroORM } from '@mikro-orm/postgresql';
import { getConfig } from '../src/mikro-orm.config';
import {
  TourEntity,
  TravelEntity,
  UserEntity,
  UserPermissionEntity,
} from '../src/entities';
import { User } from '@weroad-test/models/lib';
import * as dotenv from 'dotenv';
import { hash } from '../src/utils/hash.utils';
import * as fc from 'fast-check';
import { TravelArb } from '../test/arbitraries/travel.arbitrary';
import { CreateUserBodyArb } from '../test/arbitraries/user.arbitrary';
import { TourArb } from '../test/arbitraries/tour.arbitrary';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? '.env' });

const run = async () => {
  const adminPerms = [
    User.TRAVEL_ALL.value,
    User.TOUR_ALL.value,
    User.USER_ALL.value,
  ];
  const [adminData] = fc.sample(CreateUserBodyArb, 1).map((u) => ({
    ...u,
    permissions: adminPerms,
  }));

  const editorPerms = [User.TRAVEL_ALL.value, User.TOUR_ALL.value];
  const [editorData] = fc.sample(CreateUserBodyArb, 1).map((u) => ({
    ...u,
    permissions: editorPerms,
  }));

  const tourPlannerPerms = [User.TOUR_ALL.value];

  const [tourPlannerData] = fc.sample(CreateUserBodyArb, 1).map((u) => ({
    ...u,
    permissions: tourPlannerPerms,
  }));

  const orm = await MikroORM.init(getConfig());

  const em = orm.em.fork();

  const perms = await em.find(UserPermissionEntity, {});

  const [admin, editor, tourPlanner] = await Promise.all(
    [adminData, editorData, tourPlannerData].map(async (u) => {
      const p = await hash(u.password);
      const user = em.create(UserEntity, {
        ...u,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: p,
        permissions: perms.filter((p) =>
          u.permissions.includes(p.permission as any),
        ),
      });

      return { ...u, ...user, password: u.password };
    }),
  );

  await em.flush();

  const travels = fc.sample(TravelArb, 25).map((t, i) => {
    return {
      ...t,
      creator: i % 3 == 0 ? tourPlanner : i % 2 === 0 ? editor : admin,
    };
  });

  await Promise.all(
    travels.map(async ({ creator, ...t }) => {
      const travel = em.create(TravelEntity, {
        ...t,
        tours: [],
        user: { id: creator.id },
      });

      await em.flush();

      console.log(`Inserted travel ${travel.name}\n`);

      const tours = fc.sample(TourArb({ travelId: t.id }), 40);

      await Promise.all(
        tours.map(async ({ travel: _travel, ...tour }) => {
          em.create(TourEntity, { ...tour, travel: { id: travel.id } });

          console.log('\t\tInserted tour ', tour.name);
          await em.flush();
        }),
      );
    }),
  );

  await em.flush();

  await orm.close();

  console.log('\n');
  console.log(`Inserting admin user: ${admin.username}/${admin.password}`);
  console.log(`Inserting editor user: ${editor.username}/${editor.password}`);
  console.log(
    `Inserting tour-planner user: ${tourPlanner.username}/${tourPlanner.password}`,
  );
};

void run();
