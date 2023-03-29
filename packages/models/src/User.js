"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.CreateUserBody = exports.LoginUserBody = exports.UserPermission = exports.USER_ALL = exports.USER_DEL = exports.USER_WRITE = exports.USER_READ = exports.TOUR_ALL = exports.TOUR_DEL = exports.TOUR_WRITE = exports.TOUR_READ = exports.TRAVEL_ALL = exports.TRAVEL_DEL = exports.TRAVEL_WRITE = exports.TRAVEL_READ = void 0;
const t = require("io-ts");
const DateFromISOString_1 = require("io-ts-types/lib/DateFromISOString");
const UUID_1 = require("io-ts-types/lib/UUID");
exports.TRAVEL_READ = t.literal("travel:read");
exports.TRAVEL_WRITE = t.literal("travel:write");
exports.TRAVEL_DEL = t.literal("travel:delete");
exports.TRAVEL_ALL = t.literal("travel:*");
exports.TOUR_READ = t.literal("tour:read");
exports.TOUR_WRITE = t.literal("tour:write");
exports.TOUR_DEL = t.literal("tour:delete");
exports.TOUR_ALL = t.literal("tour:*");
exports.USER_READ = t.literal("user:read");
exports.USER_WRITE = t.literal("user:write");
exports.USER_DEL = t.literal("user:delete");
exports.USER_ALL = t.literal("user:*");
exports.UserPermission = t.union([
    exports.TRAVEL_READ,
    exports.TRAVEL_WRITE,
    exports.TRAVEL_DEL,
    exports.TRAVEL_ALL,
    exports.TOUR_READ,
    exports.TOUR_WRITE,
    exports.TOUR_DEL,
    exports.TOUR_ALL,
    exports.USER_READ,
    exports.USER_WRITE,
    exports.USER_DEL,
    exports.USER_ALL,
], "UserRole");
exports.LoginUserBody = t.strict({
    username: t.string,
    password: t.string,
}, "LoginUserBody");
exports.CreateUserBody = t.strict(Object.assign(Object.assign({}, exports.LoginUserBody.type.props), { email: t.string, permissions: t.array(exports.UserPermission) }), "CreateUserBody");
const _a = exports.CreateUserBody.type.props, { password } = _a, userProps = __rest(_a, ["password"]);
exports.User = t.strict(Object.assign(Object.assign({}, userProps), { id: UUID_1.UUID, createdAt: DateFromISOString_1.DateFromISOString, updatedAt: DateFromISOString_1.DateFromISOString }), "User");
//# sourceMappingURL=User.js.map