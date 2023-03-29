import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  // constructor(username: string, password: string) {
  //   this.username = username;
  //   this.password = password;
  // }
}
