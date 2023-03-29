import { Field, InputType } from '@nestjs/graphql';
import { UserPermission } from '@weroad-test/models/src/User';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [String])
  permissions: UserPermission[];
}
