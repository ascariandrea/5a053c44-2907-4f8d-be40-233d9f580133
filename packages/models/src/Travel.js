"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Travel = exports.CreateTravelBody = exports.GetTravelListQuery = void 0;
const t = require("io-ts");
const DateFromISOString_1 = require("io-ts-types/lib/DateFromISOString");
const NumberFromString_1 = require("io-ts-types/lib/NumberFromString");
const UUID_1 = require("io-ts-types/lib/UUID");
const User_1 = require("./User");
exports.GetTravelListQuery = t.strict({
    slug: t.union([t.string, t.undefined]),
    skip: t.union([NumberFromString_1.NumberFromString, t.undefined]),
    take: t.union([NumberFromString_1.NumberFromString, t.undefined]),
}, "GetTravelListQuery");
exports.CreateTravelBody = t.strict({
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
}, "CreateTravelBody");
exports.Travel = t.strict(Object.assign(Object.assign({}, exports.CreateTravelBody.type.props), { id: UUID_1.UUID, creator: User_1.User, createdAt: DateFromISOString_1.DateFromISOString, updatedAt: DateFromISOString_1.DateFromISOString }), "Travel");
//# sourceMappingURL=Travel.js.map