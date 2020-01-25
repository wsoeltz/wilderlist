import { User, PermissionTypes } from './graphQLTypes';

export const isLoggedIn = (user: User | undefined | null) => user !== undefined && user !== null;

export const isCorrectUser = (user: User | undefined | null, claimedUser: User | undefined | null) =>
  user && claimedUser && user._id.toString() === claimedUser._id.toString();

export const isAdmin = (user: User | undefined | null) => user && user.permissions === PermissionTypes.admin;
