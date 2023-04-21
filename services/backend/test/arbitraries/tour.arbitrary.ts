import { Tour } from '@weroad-test/models/lib';
import * as fc from 'fast-check';
import { UUIDArb } from './uuid.arbitrary';
import { RandomWordArb } from './random-word.arbitrary';
import { addYears } from 'date-fns';
import { UUID } from 'io-ts-types/lib/UUID';

interface TourArbOpts {
  travelId: string;
}

export const CreateTourBodyArb = (
  opts: TourArbOpts,
): fc.Arbitrary<Tour.CreateTourBody> =>
  fc.record({
    name: RandomWordArb({ count: 6 }),
    price: fc.nat({ max: 100 }).map((n) => n * 100),
    startingDate: fc.date({ min: new Date(), max: addYears(new Date(), 10) }),
    travelId: fc.constant(opts.travelId as any as UUID),
  });

export const TourArb = (opts: TourArbOpts): fc.Arbitrary<Tour.Tour> =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CreateTourBodyArb(opts).chain(({ travelId, ...b }) =>
    fc
      .record({
        id: UUIDArb,
        createdAt: fc.date({ min: new Date(), max: addYears(new Date(), 10) }),
        updatedAt: fc.date({ min: new Date(), max: addYears(new Date(), 10) }),
        endingDate: fc.date({ min: new Date(), max: addYears(new Date(), 10) }),
        travel: fc.record({
          id: fc.constant(opts.travelId),
        }) as fc.Arbitrary<any>,
      })
      .map((u) => ({ ...b, ...u })),
  );
