import { PermissionTypes, User } from './graphQLTypes';

export const isLoggedIn = (user: User | undefined | null) => user !== undefined && user !== null;

export const isCorrectUser = (user: {_id: string} | undefined | null, claimedUser: {_id: string} | undefined | null) =>
  user && claimedUser && user._id.toString() === claimedUser._id.toString();

export const isAdmin = (user: User | undefined | null) => user && user.permissions === PermissionTypes.admin;
