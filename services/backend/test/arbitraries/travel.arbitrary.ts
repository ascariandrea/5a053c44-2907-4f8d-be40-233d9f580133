import { Travel } from '../../src/models';
import * as fc from 'fast-check';
import { UUIDArb } from './uuid.arbitrary';

export const CreateTravelBodyArb: fc.Arbitrary<Travel.CreateTravelBody> =
  fc.record({
    slug: fc
      .string({ minLength: 5, maxLength: 40 })
      .chain((slug) => UUIDArb.map((uuid) => `${slug}-${uuid}`)),
    name: fc.string({ minLength: 5, maxLength: 40 }),
    description: fc.string({ minLength: 50, maxLength: 400 }),
    numberOfDays: fc.integer(),
    moods: fc.record({
      nature: fc.integer(),
      relax: fc.integer(),
      culture: fc.integer(),
      party: fc.integer(),
      history: fc.integer(),
    }),
  });

export const TravelArb: fc.Arbitrary<Travel.Travel> = fc
  .record({
    id: UUIDArb,
    createdAt: fc.date(),
    updatedAt: fc.date(),
    creator: fc.record({}) as fc.Arbitrary<any>,
  })
  .chain((u) => CreateTravelBodyArb.map((b) => ({ ...b, ...u })));
