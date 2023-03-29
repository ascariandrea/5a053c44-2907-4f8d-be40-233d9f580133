import { User } from '../../src/models';
import * as fc from 'fast-check';
import { UUIDArb } from './uuid.arbitrary';

export const UserPermissionArb: fc.Arbitrary<User.UserPermission> = fc.oneof(
  ...User.UserPermission.types.map((t) => fc.constant(t.value)),
);

export const CreateUserBodyArb: fc.Arbitrary<User.CreateUserBody> = fc.record({
  email: fc.emailAddress(),
  username: fc.string({ minLength: 4, maxLength: 20 }),
  password: fc.string({ minLength: 4, maxLength: 20 }),
  permissions: fc.array(UserPermissionArb),
});

export const UserArb: fc.Arbitrary<User.User> = fc.record({
  id: UUIDArb,
  email: fc.emailAddress(),
  username: fc.string({ minLength: 4, maxLength: 20 }),
  permissions: fc.array(UserPermissionArb),
  createdAt: fc.date(),
  updatedAt: fc.date(),
});
