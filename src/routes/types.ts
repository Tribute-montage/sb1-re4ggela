// src/routes/types.ts
import { ROUTES } from './constants';

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

export interface RouteConfig {
  path: RoutePath;
  title: string;
  isProtected: boolean;
  allowedRoles?: ('client' | 'admin')[];
}