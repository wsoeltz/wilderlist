import {uniq, uniqBy} from 'lodash';
import React from 'react';
import {
  AscentNotification,
  Mountain,
} from '../../../../types/graphQLTypes';
import { DateType, getDates, getDateType } from '../../Utils';
import MountainCompletionModal, {
  Props as BaseProps,
} from './MountainCompletionModal';

type Props = BaseProps & {
  date: string;
  ascentNotifications: AscentNotification[];
};

const NewAscentReport = (props: Props) => {

  const date = getDates([props.date]).pop();

  const initialCompletionDay = date && !isNaN(date.day) ? date.day.toString() : '';
  const initialCompletionMonth = date && !isNaN(date.month) ? date.month.toString() : '';
  const initialCompletionYear = date && !isNaN(date.year) ? date.year.toString() : '';

  const initialStartDate = date && date.year && date.month && date.month && date.day
    ? new Date(date.year, date.month - 1, date.day) : null;

  const initialDateType = date ? getDateType(date) : DateType.full;

  const sameDateNotifications = props.ascentNotifications.filter(
    n => n.date === props.date && n.mountain !== null && n.mountain.id !== props.editMountainId && n.user !== null,
  );

  const allUsers: string[] = [];
  const allMountains: Mountain[] = [];
  sameDateNotifications.forEach(n => {
    if (n.user) {
      allUsers.push(n.user.id);
    }
    if (n.mountain) {
      allMountains.push(n.mountain);
    }
  });

  const initialUserList: string[] = uniq(allUsers);
  const initialMountainList: Mountain[] = uniqBy(allMountains, 'id');

  return (
    <MountainCompletionModal
      {...props}
      tripReportId={undefined}
      initialCompletionDay={initialCompletionDay}
      initialCompletionMonth={initialCompletionMonth}
      initialCompletionYear={initialCompletionYear}
      initialStartDate={initialStartDate}
      initialDateType={initialDateType}
      initialUserList={initialUserList}
      initialMountainList={initialMountainList}
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
    />
  );
};

export default NewAscentReport;
