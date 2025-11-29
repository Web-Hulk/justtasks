import { Role } from '../types/types.js';

type PermissionsMatrix = {
  [key: string]: Role[];
};

export const permissionsMatrix: PermissionsMatrix = {
  'GET:/me': [Role.ADMIN, Role.USER],
  'PUT:/me': [Role.ADMIN, Role.USER],
  'DELETE:/me': [Role.ADMIN, Role.USER],
  'GET:/roles': [Role.ADMIN],
  'GET:/users': [Role.ADMIN],
  'GET:/users/:id': [Role.ADMIN],
  'PUT:/users/:id/role': [Role.ADMIN],
  'DELETE:/users/:id': [Role.ADMIN]
};
