import { MikroORM } from '@mikro-orm/postgresql';
import { getConfig } from '../mikro-orm.config';
import { UserEntity, UserPermissionEntity } from '../src/entities';
import { User } from '@weroad-test/models/lib';
import * as dotenv from 'dotenv';
import { hash } from '../src/utils/hash.utils';

dotenv.config({ path: '.env' });

const run = async () => {
  const args = process.argv;

  console.log(args);
  if (args.length < 5) {
    throw new Error(`
        Correct usage ./create-user.ts $username $password admin|editor|tour-planner
    `);
  }
  const [email, password, role = 'tour-planner'] = process.argv.splice(2, 4);

  const permissions =
    role === 'admin'
      ? [User.TRAVEL_ALL.value, User.TOUR_ALL.value, User.USER_ALL.value]
      : role === 'editor'
      ? [User.TRAVEL_ALL.value, User.TOUR_ALL.value]
      : [User.TOUR_ALL.value];

  const orm = await MikroORM.init(getConfig());

  const em = orm.em.fork();

  const perms = await em.find(UserPermissionEntity, {
    permission: { $in: permissions },
  });

  const p = await hash(password);

  em.create(UserEntity, {
    createdAt: new Date(),
    updatedAt: new Date(),
    email,
    username: email,
    password: p,
    permissions: perms,
  });

  await em.flush();

  await orm.close();
};

void run();
