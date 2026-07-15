import { publicRoutes } from './publicRoutes';
import { userRoutes } from './userRoutes';
import { creatorRoutes } from './creatorRoutes';

export const appRoutes = [...publicRoutes, ...userRoutes, ...creatorRoutes];