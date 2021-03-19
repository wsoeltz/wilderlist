import queryString from 'query-string';
import {PeakListVariants} from '../types/graphQLTypes';
import {
  Months,
  Seasons,
} from '../Utils';
import { Routes } from './routes';

export const listDetailLink = (id: string) => Routes.ListDetail.replace(':id', id);

export const mountainDetailLink = (id: string) => Routes.MountainDetail.replace(':id', id);

export const summitViewLink = (lat: number, lng: number, altitude: number, id: string) =>
  Routes.SummitView
    .replace(':id', id)
    .replace(':lat', lat.toFixed(6))
    .replace(':lng', lng.toFixed(6))
    .replace(':altitude', (altitude * 0.3048).toFixed(0));

export const campsiteDetailLink = (id: string) => Routes.CampsiteDetail.replace(':id', id);

export const trailDetailLink = (id: string) => Routes.TrailDetail.replace(':id', id);

export type AddTripReportLinkParams = {
  refpath?: string | null;
  mountains?: string | string[] | null;
  trails?: string | string[] | null;
  campsites?: string | string[] | null;
  friends?: string | string[] | null;
  listtype?: PeakListVariants | null;
  month?: Months | null;
  season?: Seasons | null;
  date?: string | null;
  notification?: 'yes' | 'no' | null;
};

export type EditTripReportLinkParams = AddTripReportLinkParams & {
  id?: string | null;
  date: string;
};

export const addTripReportLink = (input: AddTripReportLinkParams) => {
  const query = queryString.stringify(input);
  return query ? Routes.AddTripReport + '?' + query : Routes.AddTripReport;
};
export const editTripReportLink = (input: EditTripReportLinkParams) => {
  const query = queryString.stringify(input);
  return query ? Routes.EditTripReport + '?' + query : Routes.AddTripReport;
};

export const userProfileLink = (id: string) => Routes.UserProfile.replace(':id', id);

export const otherUserPeakListLink = (friendId: string, peakListId: string) =>
  Routes.OtherUserPeakList.replace(':id', friendId).replace(':peakListId', peakListId);

export const comparePeakListIsolatedLink = (friendId: string, peakListId: string) =>
  Routes.ComparePeakListIsolated.replace(':id', friendId).replace(':peakListId', peakListId);

export const editMountainLink = (id: string) => Routes.EditMountain.replace(':id', id);
export const editCampsiteLink = (id: string) => Routes.EditCampsite.replace(':id', id);
export const editTrailLink = (id: string) => Routes.EditTrail.replace(':id', id);
export const editTrailParentLink = (id: string) => Routes.EditTrailParent.replace(':id', id);
export const editPeakListLink = (id: string) => Routes.EditList.replace(':id', id);

export const preventNavigation = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
