import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

/**
 * Based on https://docs.nestjs.com/graphql/resolvers#generics
 *
 * @param classRef
 */
export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => Int)
    total: number;

    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];
  }

  return PaginatedType;
}
