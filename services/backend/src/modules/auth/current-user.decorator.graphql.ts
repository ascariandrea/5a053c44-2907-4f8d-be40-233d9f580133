import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data, context) => {
  const user = GqlExecutionContext.create(context).getContext().req?.user;

  return user;
});
