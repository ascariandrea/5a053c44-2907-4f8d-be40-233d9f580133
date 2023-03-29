import { Migration } from '@mikro-orm/migrations';
import { User } from '@weroad-test/models/lib';
import { v4 } from 'uuid';

export class Migration20230501151556 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `insert into "user_permission" (id, permission) values ${User.UserPermission.types
        .map((t) => `('${v4()}', '${t.value}')`)
        .join(', ')}`,
    );
  }
}
