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
import Modal from '../../sharedComponents/Modal';
import TripReportForm, {
  ButtonWrapper,
  CancelButton,
  Props as BaseProps,
} from './TripReportForm';

type Props = BaseProps & {
  date: DateObject;
};

const EditAscentReport = (props: Props) => {
  const {userId, date, initialMountainList} = props;

  const getString = useFluent();
  const day = !isNaN(date.day) ? date.day.toString() : '';
  const month = !isNaN(date.month) ? date.month.toString() : '';
  const year = !isNaN(date.year) ? date.year.toString() : '';
  const parsedDate = convertFieldsToDate(day, month, year);
  const stringDate = parsedDate.date ? parsedDate.date : 'XXXX-XX-XX-XX-XX';

  const variables = useMemo(() => ({
    author: userId,
    mountain: initialMountainList[0].id,
    date: stringDate,
  }), [userId, stringDate, initialMountainList]);

  const refetchQuery = useMemo(() =>
    [refetchTripReportForDateAndMountain(variables)],
    [variables],
  );

  const {loading, error, data} = useGetTripReportForDateAndMountain(variables);
  const initialStartDate = date.year && date.month && date.month && date.day
    ? new Date(date.year, date.month - 1, date.day) : null;

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={props.onClose}>
        {getString('global-text-value-modal-cancel')}
      </CancelButton>
    </ButtonWrapper>
  );
  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return (
      <Modal
        onClose={props.onClose}
        width={'300px'}
        height={'auto'}
        actions={actions}
      >
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      </Modal>
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
        id, users, mountains, notes, link,
        mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
        iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
        snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
        snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown, obstaclesOther,
        privacy,
      } = tripReport;

      const filteredMountains = mountains.filter(notEmpty);
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
          initialConditions={{
            mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
            iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
            snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
            snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown, obstaclesOther,
          }}
          initialTripNotes={notes ? notes : ''}
          initialLink={link ? link : ''}
          initialPrivacy={privacy ? privacy : TripReportPrivacy.Private}
        />
      );
    }
  } else {
    return null;
  }
};

export default EditAscentReport;
