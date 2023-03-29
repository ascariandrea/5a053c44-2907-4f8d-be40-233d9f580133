import { Travel } from '@weroad-test/models/lib';
import * as fc from 'fast-check';
import { UUIDArb } from './uuid.arbitrary';
import { RandomWordArb } from './random-word.arbitrary';
import { addYears } from 'date-fns';

export const CreateTravelBodyArb: fc.Arbitrary<Travel.CreateTravelBody> =
  fc.record({
    name: RandomWordArb({ joinChar: ' ', count: 6 }),
    slug: RandomWordArb({ count: 6 }),
    description: fc.lorem(),
    numberOfDays: fc.nat({ max: 100 }),
    moods: fc.record({
      nature: fc.nat({ max: 10 }),
      relax: fc.nat({ max: 10 }),
      culture: fc.nat({ max: 10 }),
      party: fc.nat({ max: 10 }),
      history: fc.nat({ max: 10 }),
    }),
  });

export const TravelArb: fc.Arbitrary<Travel.Travel> = fc
  .record({
    id: UUIDArb,
    createdAt: fc.date({ min: new Date(), max: addYears(new Date(), 10) }),
    updatedAt: fc.date({ min: new Date(), max: addYears(new Date(), 10) }),
    creator: fc.record({}) as fc.Arbitrary<any>,
  })
  .chain((u) => CreateTravelBodyArb.map((b) => ({ ...b, ...u })));
