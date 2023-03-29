import { Migration } from '@mikro-orm/migrations';

export class Migration20230329130453 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, constraint "user_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_username_unique" unique ("email", "username");',
    );

    this.addSql(
      'create table "travel" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "slug" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "number_of_days" int not null, "moods" varchar(255) not null, "user_id" uuid not null, constraint "travel_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "travel" add constraint "travel_slug_unique" unique ("slug");',
    );

    this.addSql(
      'create table "tour" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(255) not null, "starting_date" timestamptz(0) not null, "ending_date" timestamptz(0) not null, "price" int not null, "travel_id" uuid not null, constraint "tour_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "user_permission" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "permission" varchar(255) not null, constraint "user_permission_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user_permission" add constraint "user_permission_permission_unique" unique ("permission");',
    );

    this.addSql(
      'create table "user_permission_users" ("user_permission_entity_id" uuid not null, "user_entity_id" uuid not null, constraint "user_permission_users_pkey" primary key ("user_permission_entity_id", "user_entity_id"));',
    );

    this.addSql(
      'alter table "travel" add constraint "travel_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "tour" add constraint "tour_travel_id_foreign" foreign key ("travel_id") references "travel" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "user_permission_users" add constraint "user_permission_users_user_permission_entity_id_foreign" foreign key ("user_permission_entity_id") references "user_permission" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_permission_users" add constraint "user_permission_users_user_entity_id_foreign" foreign key ("user_entity_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }
}
