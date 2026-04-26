export type { router as Router } from "./router.js";
export type * from "./shared/database/types.js";

// kyesly goodies
export { NoResultError, type Selectable } from "kysely";
export { DatabaseError } from "pg";

export * from "./domains/airport/service.js";
export * from "./domains/flight-route/service.js";
export { router } from "./router.js";
export * from "./shared/schemas.js";
export * from "./shared/utils/errors.js";
