import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types/lib/DateFromISOString";
import { UUID } from "io-ts-types/lib/UUID";

/**
 * Permissions
 *
 * Permissions enables granular access on resources.
 * It has the form of {resource}:{read,write,delete,*}
 */
// Travel permissions
export const TRAVEL_READ = t.literal("travel:read");
export type TRAVEL_READ = t.TypeOf<typeof TRAVEL_READ>;

export const TRAVEL_WRITE = t.literal("travel:write");
export type TRAVEL_WRITE = t.TypeOf<typeof TRAVEL_WRITE>;

export const TRAVEL_DEL = t.literal("travel:delete");
export type TRAVEL_DEL = t.TypeOf<typeof TRAVEL_DEL>;

export const TRAVEL_ALL = t.literal("travel:*");
export type TRAVEL_ALL = t.TypeOf<typeof TRAVEL_ALL>;

// Tour permissions
export const TOUR_READ = t.literal("tour:read");
export type TOUR_READ = t.TypeOf<typeof TOUR_READ>;

export const TOUR_WRITE = t.literal("tour:write");
export type TOUR_WRITE = t.TypeOf<typeof TOUR_WRITE>;

export const TOUR_DEL = t.literal("tour:delete");
export type TOUR_DEL = t.TypeOf<typeof TOUR_DEL>;

export const TOUR_ALL = t.literal("tour:*");
export type TOUR_ALL = t.TypeOf<typeof TOUR_ALL>;

// User permissions
export const USER_READ = t.literal("user:read");
export type USER_READ = t.TypeOf<typeof USER_READ>;

export const USER_WRITE = t.literal("user:write");
export type USER_WRITE = t.TypeOf<typeof USER_WRITE>;

export const USER_DEL = t.literal("user:delete");
export type USER_DEL = t.TypeOf<typeof USER_DEL>;

export const USER_ALL = t.literal("user:*");
export type USER_ALL = t.TypeOf<typeof USER_ALL>;

export const UserPermission = t.union(
  [
    TRAVEL_READ,
    TRAVEL_WRITE,
    TRAVEL_DEL,
    TRAVEL_ALL,
    TOUR_READ,
    TOUR_WRITE,
    TOUR_DEL,
    TOUR_ALL,
    USER_READ,
    USER_WRITE,
    USER_DEL,
    USER_ALL,
  ],
  "UserRole"
);
export type UserPermission = t.TypeOf<typeof UserPermission>;

export const LoginUserBody = t.strict(
  {
    username: t.string,
    password: t.string,
  },
  "LoginUserBody"
);
export type LoginUserBody = t.TypeOf<typeof LoginUserBody>;

export const CreateUserBody = t.strict(
  {
    ...LoginUserBody.type.props,
    email: t.string,

    permissions: t.array(UserPermission),
  },
  "CreateUserBody"
);

export type CreateUserBody = t.TypeOf<typeof CreateUserBody>;

const { password, ...userProps } = CreateUserBody.type.props;
export const User = t.strict(
  {
    ...userProps,
    id: UUID,
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
  },
  "User"
);

export type User = t.TypeOf<typeof User>;
