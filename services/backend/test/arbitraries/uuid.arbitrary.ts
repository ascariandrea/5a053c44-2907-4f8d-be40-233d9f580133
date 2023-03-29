import { UUID } from 'io-ts-types/lib/UUID';
import * as fc from 'fast-check';

export const UUIDArb = fc.uuidV(4) as fc.Arbitrary<UUID>;
