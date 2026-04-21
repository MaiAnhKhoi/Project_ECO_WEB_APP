export const STAFF_ROLE_CODES = [
  "ADMIN",
  "PRODUCT_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SERVICE",
  "MARKETING_STAFF",
  "ACCOUNTANT",
] as const;

export type StaffRoleCode = (typeof STAFF_ROLE_CODES)[number];

