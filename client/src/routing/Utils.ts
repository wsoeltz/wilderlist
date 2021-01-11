import queryString from 'query-string';
import {PeakListVariants} from '../types/graphQLTypes';
import {
  Months,
  Seasons,
} from '../Utils';
import { Routes } from './routes';

export const listDetailLink = (id: string) => Routes.ListDetail.replace(':id', id);

export const mountainDetailLink = (id: string) => Routes.MountainDetail.replace(':id', id);

export const campsiteDetailLink = (id: string) => Routes.CampsiteDetail.replace(':id', id);

export const trailDetailLink = (id: string) => Routes.TrailDetail.replace(':id', id);

export type AddTripReportLinkParams = {
  refpath?: string | null;
  mountain?: string | null;
  trail?: string | null;
  campsite?: string | null;
  listtype?: PeakListVariants | null;
  month?: Months | null;
  season?: Seasons | null;
};

export const addTripReportLink = (input: AddTripReportLinkParams) => {
  const query = queryString.stringify(input);
  return query ? Routes.AddTripReport + '?' + query : Routes.AddTripReport;
};

export const userProfileLink = (id: string) => Routes.UserProfile.replace(':id', id);

export const otherUserPeakListLink = (friendId: string, peakListId: string) =>
  Routes.OtherUserPeakList.replace(':id', friendId).replace(':peakListId', peakListId);

export const comparePeakListIsolatedLink = (friendId: string, peakListId: string) =>
  Routes.ComparePeakListIsolated.replace(':id', friendId).replace(':peakListId', peakListId);

export const editMountainLink = (id: string) => Routes.EditMountain.replace(':id', id);
export const editPeakListLink = (id: string) => Routes.EditList.replace(':id', id);

export const preventNavigation = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
