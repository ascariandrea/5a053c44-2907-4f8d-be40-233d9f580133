import { PrimaryKey, Property } from '@mikro-orm/core';
import { UUID } from 'io-ts-types/lib/UUID';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: UUID = uuid() as any;

  @Property({ type: 'timestamptz', defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
