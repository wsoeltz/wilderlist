import { Routes } from './routes';

export const listDetailLink = ((listId: string) => Routes.ListDetail.replace(':listId', listId));
export const mountainDetailLink = ((mountainId: string) => Routes.MountainDetail.replace(':mountainId', mountainId));
export const userProfileLink = ((userId: string) => Routes.UserProfile.replace(':userId', userId));

export const preventNavigation = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
