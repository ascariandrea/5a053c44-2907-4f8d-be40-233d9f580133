import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types/lib/DateFromISOString";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";
import { UUID } from "io-ts-types/lib/UUID";
import { User } from "./User";
import { Travel } from "./Travel";

/**
 * Query codec for GET /tours
 */
export const GetTravelListQuery = t.strict(
  {
    slug: t.union([t.string, t.undefined]),
    skip: t.union([NumberFromString, t.undefined]),
    take: t.union([NumberFromString, t.undefined]),
  },
  "GetTravelListQuery"
);
export type GetTravelListQuery = t.TypeOf<typeof GetTravelListQuery>;

/**
 * Body codec for POST /tours
 */
export const CreateTourBody = t.strict(
  {
    name: t.string,
    startingDate: DateFromISOString,
    price: t.number,
    travelId: UUID,
  },
  "CreateTourBody"
);

export type CreateTourBody = t.TypeOf<typeof CreateTourBody>;

const { travelId, ...createTourBodyProps } = CreateTourBody.type.props;

/**
 * Tour API codec
 */
export const Tour = t.strict(
  {
    ...createTourBodyProps,
    id: UUID,
    endingDate: DateFromISOString,
    travel: Travel,
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
  },
  "Tour"
);

export type Tour = t.TypeOf<typeof Tour>;
