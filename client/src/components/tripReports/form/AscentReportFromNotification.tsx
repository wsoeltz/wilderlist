import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import {
  useGetNotifications,
} from '../../../queries/notifications/useGetNotifications';
import {
  TripReportPrivacy,
} from '../../../types/graphQLTypes';
import { DateType, getDates, getDateType } from '../../../utilities/dateUtils';
import TripReportForm, {
  Origin,
  Props as BaseProps,
} from './TripReportForm';

type Props = BaseProps & {
  date: string;
};

const NewAscentReport = (props: Props) => {

  const {loading, error, data} = useGetNotifications(props.userId);
  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { user } = data;
    const ascentNotifications = user && user.ascentNotifications ? user.ascentNotifications : [];
    const trailNotifications = user && user.trailNotifications ? user.trailNotifications : [];
    const campsiteNotifications = user && user.campsiteNotifications ? user.campsiteNotifications : [];
    const date = getDates([props.date]).pop();

    const initialCompletionDay = date && !isNaN(date.day) ? date.day.toString() : '';
    const initialCompletionMonth = date && !isNaN(date.month) ? date.month.toString() : '';
    const initialCompletionYear = date && !isNaN(date.year) ? date.year.toString() : '';

    const initialStartDate = date && date.year && date.month && date.month && date.day
      ? new Date(date.year, date.month - 1, date.day) : null;

    const initialDateType = date ? getDateType(date) : DateType.full;

    const sameDateMountainNotifications = ascentNotifications.filter(
      n => n.date === props.date && n.mountain !== null && n.user !== null);
    const sameDateTrailNotifications = trailNotifications.filter(
      n => n.date === props.date && n.trail !== null && n.user !== null);
    const sameDateCampsiteNotifications = campsiteNotifications.filter(
      n => n.date === props.date && n.campsite !== null && n.user !== null);

    const allUsers: string[] = [];
    const allMountains: BaseProps['initialMountainList'] = [];
    sameDateMountainNotifications.forEach(n => {
      if (n.user) {
        allUsers.push(n.user.id);
      }
      if (n.mountain) {
        allMountains.push(n.mountain);
      }
    });
    const allTrails: BaseProps['initialTrailList'] = [];
    sameDateTrailNotifications.forEach(n => {
      if (n.user) {
        allUsers.push(n.user.id);
      }
      if (n.trail) {
        allTrails.push(n.trail);
      }
    });
    const allCampsites: BaseProps['initialCampsiteList'] = [];
    sameDateCampsiteNotifications.forEach(n => {
      if (n.user) {
        allUsers.push(n.user.id);
      }
      if (n.campsite) {
        allCampsites.push(n.campsite);
      }
    });

    const initialUserList: string[] = uniq(allUsers);
    const initialMountainList: BaseProps['initialMountainList'] = uniqBy(allMountains, 'id');
    const initialTrailList: BaseProps['initialTrailList'] = uniqBy(allTrails, 'id');
    const initialCampsiteList: BaseProps['initialCampsiteList'] = uniqBy(allCampsites, 'id');

    return (
      <TripReportForm
        key={initialStartDate as any}
        {...props}
        origin={Origin.add}
        tripReportId={undefined}
        refetchQuery={undefined}
        initialCompletionDay={initialCompletionDay}
        initialCompletionMonth={initialCompletionMonth}
        initialCompletionYear={initialCompletionYear}
        initialStartDate={initialStartDate}
        initialDateType={initialDateType}
        initialUserList={initialUserList}
        initialMountainList={initialMountainList}
        initialTrailList={initialTrailList}
        initialCampsiteList={initialCampsiteList}
        initialConditions={{
          mudMinor: false,
          mudMajor: false,
          waterSlipperyRocks: false,
          waterOnTrail: false,
          leavesSlippery: false,
          iceBlack: false,
          iceBlue: false,
          iceCrust: false,
          snowIceFrozenGranular: false,
          snowIceMonorailStable: false,
          snowIceMonorailUnstable: false,
          snowIcePostholes: false,
          snowMinor: false,
          snowPackedPowder: false,
          snowUnpackedPowder: false,
          snowDrifts: false,
          snowSticky: false,
          snowSlush: false,
          obstaclesBlowdown: false,
          obstaclesOther: false,
        }}
        initialTripNotes={''}
        initialLink={''}
        initialPrivacy={TripReportPrivacy.Public}
      />
    );
  } else {
    return null;
  }

};

export default NewAscentReport;
