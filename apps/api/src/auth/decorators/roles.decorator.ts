import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// Specific role decorators for convenience
export const SuperAdminOnly = () => Roles(UserRole.SUPER_ADMIN);
export const ManagerOnly = () => Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER);
export const SellerOnly = () => Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.SELLER);
export const BuyerOnly = () => Roles(UserRole.BUYER);
