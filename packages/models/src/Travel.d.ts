import * as t from "io-ts";
export declare const GetTravelListQuery: t.ExactC<t.TypeC<{
    slug: t.UnionC<[t.StringC, t.UndefinedC]>;
    skip: t.UnionC<[import("io-ts-types/lib/NumberFromString").NumberFromStringC, t.UndefinedC]>;
    take: t.UnionC<[import("io-ts-types/lib/NumberFromString").NumberFromStringC, t.UndefinedC]>;
}>>;
export type GetTravelListQuery = t.TypeOf<typeof GetTravelListQuery>;
export declare const CreateTravelBody: t.ExactC<t.TypeC<{
    slug: t.StringC;
    name: t.StringC;
    description: t.StringC;
    numberOfDays: t.NumberC;
    moods: t.ExactC<t.TypeC<{
        nature: t.NumberC;
        relax: t.NumberC;
        history: t.NumberC;
        culture: t.NumberC;
        party: t.NumberC;
    }>>;
}>>;
export type CreateTravelBody = t.TypeOf<typeof CreateTravelBody>;
export declare const Travel: t.ExactC<t.TypeC<{
    id: t.BrandC<t.StringC, import("io-ts-types/lib/UUID").UUIDBrand>;
    creator: t.ExactC<t.TypeC<{
        id: t.BrandC<t.StringC, import("io-ts-types/lib/UUID").UUIDBrand>;
        createdAt: import("io-ts-types/lib/DateFromISOString").DateFromISOStringC;
        updatedAt: import("io-ts-types/lib/DateFromISOString").DateFromISOStringC;
        email: t.StringC;
        permissions: t.ArrayC<t.UnionC<[t.LiteralC<"travel:read">, t.LiteralC<"travel:write">, t.LiteralC<"travel:delete">, t.LiteralC<"travel:*">, t.LiteralC<"tour:read">, t.LiteralC<"tour:write">, t.LiteralC<"tour:delete">, t.LiteralC<"tour:*">, t.LiteralC<"user:read">, t.LiteralC<"user:write">, t.LiteralC<"user:delete">, t.LiteralC<"user:*">]>>;
        username: t.StringC;
    }>>;
    createdAt: import("io-ts-types/lib/DateFromISOString").DateFromISOStringC;
    updatedAt: import("io-ts-types/lib/DateFromISOString").DateFromISOStringC;
    slug: t.StringC;
    name: t.StringC;
    description: t.StringC;
    numberOfDays: t.NumberC;
    moods: t.ExactC<t.TypeC<{
        nature: t.NumberC;
        relax: t.NumberC;
        history: t.NumberC;
        culture: t.NumberC;
        party: t.NumberC;
    }>>;
}>>;
export type Travel = t.TypeOf<typeof Travel>;
