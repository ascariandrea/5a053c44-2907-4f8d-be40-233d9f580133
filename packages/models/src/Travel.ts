import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';
import { UUID } from 'io-ts-types/lib/UUID';
import { User } from './User';

/**
 * Query codec for GET /travels
 */
export const GetTravelListQuery = t.strict(
  {
    slug: t.union([t.string, t.undefined]),
    skip: t.union([NumberFromString, t.undefined]),
    take: t.union([NumberFromString, t.undefined]),
  },
  'GetTravelListQuery',
);
export type GetTravelListQuery = t.TypeOf<typeof GetTravelListQuery>;

/**
 * Body codec for POST /travels
 */
export const CreateTravelBody = t.strict(
  {
    slug: t.string,
    name: t.string,
    description: t.string,
    numberOfDays: t.number,
    moods: t.strict({
      nature: t.number,
      relax: t.number,
      history: t.number,
      culture: t.number,
      party: t.number,
    }),
  },
  'CreateTravelBody',
);

export type CreateTravelBody = t.TypeOf<typeof CreateTravelBody>;

/**
 * Travel API codec
 */
export const Travel = t.strict(
  {
    ...CreateTravelBody.type.props,
    id: UUID,
    creator: User,
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
  },
  'Travel',
);

export type Travel = t.TypeOf<typeof Travel>;
