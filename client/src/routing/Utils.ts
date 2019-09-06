import { Routes } from './routes';

export const listDetailLink = ((id: string) => Routes.ListDetail.replace(':id', id));
export const mountainDetailLink = ((id: string) => Routes.MountainDetail.replace(':id', id));
export const userProfileLink = ((id: string) => Routes.UserProfile.replace(':id', id));
export const comparePeakListLink = ((friendId: string, peakListId: string) => {
  return Routes.ComparePeakList.replace(':friendId', friendId).replace(':peakListId', peakListId);
});

export const preventNavigation = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
