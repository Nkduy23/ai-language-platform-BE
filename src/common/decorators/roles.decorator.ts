// common/decorators/roles.decorator.ts — @Roles() metadata decorator
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Array<"USER" | "ADMIN">) => SetMetadata(ROLES_KEY, roles);
