// src/routes/constants.ts
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Client routes
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  CREATE_ORDER: '/orders/new',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_REGISTER: '/admin/register',
} as const;

export const ROUTE_TITLES = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.REGISTER]: 'Register',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.ORDERS]: 'Orders',
  [ROUTES.CREATE_ORDER]: 'Create Order',
  [ROUTES.ADMIN_DASHBOARD]: 'Admin Dashboard',
  [ROUTES.ADMIN_ORDERS]: 'Manage Orders',
  [ROUTES.ADMIN_REGISTER]: 'Register Admin',
} as const;