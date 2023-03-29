import { Migration } from '@mikro-orm/migrations';
import { User } from '../models';
import { v4 } from 'uuid';

export class Migration20230329130018 extends Migration {
  async up(): Promise<void> {
    User.UserPermission.types.forEach((t) => {
      this.addSql(
        `insert into "user_permission" (id, permission) values ('${v4()}', '${
          t.value
        }')`,
      );
    });
  }
}
