import React, {useMemo} from 'react';
import useFluent from '../../../hooks/useFluent';
import {
  refetchTripReportForDateAndMountain,
  useGetTripReportForDateAndMountain,
} from '../../../queries/tripReports/useGetTripReportForDateAndMountain';
import { PlaceholderText } from '../../../styling/styleUtils';
import {TripReportPrivacy} from '../../../types/graphQLTypes';
import {
  DateObject,
  getDateType,
} from '../../../utilities/dateUtils';
import {
  convertFieldsToDate,
  notEmpty,
} from '../../../Utils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {useMapViewBoxScroll} from '../../template/contentHeader/MobileMapViewBox';
import TripReportForm, {
  Origin,
  Props as BaseProps,
} from './TripReportForm';

type Props = BaseProps & {
  date: DateObject;
};

const EditAscentReport = (props: Props) => {
  const {userId, date, initialMountainList, initialTrailList, initialCampsiteList} = props;

  const getString = useFluent();
  const day = !isNaN(date.day) ? date.day.toString() : '';
  const month = !isNaN(date.month) ? date.month.toString() : '';
  const year = !isNaN(date.year) ? date.year.toString() : '';
  const parsedDate = convertFieldsToDate(day, month, year);
  const stringDate = parsedDate.date ? parsedDate.date : 'XXXX-XX-XX-XX-XX';

  const variables = useMemo(() => ({
    author: userId,
    mountain: initialMountainList && initialMountainList[0] ? initialMountainList[0].id : null,
    trail: initialTrailList && initialTrailList[0] ? initialTrailList[0].id : null,
    campsite: initialCampsiteList && initialCampsiteList[0] ? initialCampsiteList[0].id : null,
    date: stringDate,
  }), [userId, stringDate, initialMountainList, initialTrailList, initialCampsiteList]);

  const refetchQuery = useMemo(() =>
    [refetchTripReportForDateAndMountain(variables)],
    [variables],
  );

  const {loading, error, data} = useGetTripReportForDateAndMountain(variables);
  const initialStartDate = date.year && date.month && date.month && date.day
    ? new Date(date.year, date.month - 1, date.day) : null;

  useMapViewBoxScroll(data);

  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { tripReport } = data;
    if (tripReport === null) {
      return (
        <TripReportForm
          {...props}
          tripReportId={undefined}
          refetchQuery={[...refetchQuery]}
          initialCompletionDay={day}
          initialCompletionMonth={month}
          initialCompletionYear={year}
          initialStartDate={initialStartDate}
          initialDateType={getDateType(date)}
          initialUserList={[]}
          origin={Origin.edit}
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
      const {
        id, users, mountains, trails, campsites, notes, link,
        mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
        iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
        snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
        snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown, obstaclesOther,
        privacy,
      } = tripReport;

      const filteredMountains = mountains.filter(notEmpty);
      const filteredTrails = trails.filter(notEmpty);
      const filteredCampsites = campsites.filter(notEmpty);
      const filteredUsers = users.filter(notEmpty);

      const userList = filteredUsers.map(user => user.id);
      return (
        <TripReportForm
          {...props}
          tripReportId={id}
          refetchQuery={[...refetchQuery]}
          initialCompletionDay={day}
          initialCompletionMonth={month}
          initialCompletionYear={year}
          initialStartDate={initialStartDate}
          initialDateType={getDateType(date)}
          initialUserList={userList}
          initialMountainList={filteredMountains}
          initialTrailList={filteredTrails}
          initialCampsiteList={filteredCampsites}
          origin={Origin.edit}
          initialConditions={{
            mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
            iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
            snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
            snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown, obstaclesOther,
          }}
          initialTripNotes={notes ? notes : ''}
          initialLink={link ? link : ''}
          initialPrivacy={privacy ? privacy : TripReportPrivacy.Public}
        />
      );
    }
  } else {
    return <LoadingSpinner />;
  }
};

export default EditAscentReport;
