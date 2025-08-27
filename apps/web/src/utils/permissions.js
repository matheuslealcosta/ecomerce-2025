export const Permissions = {
  USER_MANAGE: 'user.manage',
  PRODUCT_CREATE: 'product.create',
  PRODUCT_SUBMIT: 'product.submit',
  PRODUCT_APPROVE: 'product.approve',
  PRODUCT_PUBLISH: 'product.publish',
  ORDER_VIEW_ALL: 'order.view.all',
  ORDER_VIEW_OWN: 'order.view.own',
  REVIEW_MODERATE: 'review.moderate',
  SETTINGS_MANAGE: 'settings.manage',
  REPORTS_VIEW: 'reports.view',
};

export const RoleMatrix = {
  superadmin: [
    Permissions.USER_MANAGE,
    Permissions.PRODUCT_CREATE,
    Permissions.PRODUCT_SUBMIT,
    Permissions.PRODUCT_APPROVE,
    Permissions.PRODUCT_PUBLISH,
    Permissions.ORDER_VIEW_ALL,
    Permissions.REVIEW_MODERATE,
    Permissions.SETTINGS_MANAGE,
    Permissions.REPORTS_VIEW,
  ],
  gestor: [
    Permissions.PRODUCT_APPROVE,
    Permissions.PRODUCT_PUBLISH,
    Permissions.ORDER_VIEW_ALL,
    Permissions.REVIEW_MODERATE,
    Permissions.REPORTS_VIEW,
  ],
  vendedor: [
    Permissions.PRODUCT_CREATE,
    Permissions.PRODUCT_SUBMIT,
    Permissions.ORDER_VIEW_OWN,
  ],
  comprador: [
    Permissions.ORDER_VIEW_OWN,
  ],
};

export const ProductStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
};

export const OrderStatus = {
  CREATED: 'created',
  PENDING: 'pending',
  PAID: 'paid',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
};

export const ReviewStatus = {
  PUBLISHED: 'published',
  HIDDEN: 'hidden',
  FLAGGED: 'flagged',
};

export const UserRoles = {
  SUPERADMIN: 'superadmin',
  GESTOR: 'gestor',
  VENDEDOR: 'vendedor',
  COMPRADOR: 'comprador',
};
