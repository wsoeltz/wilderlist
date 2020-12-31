import { gql, useQuery } from '@apollo/client';
import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import { PlaceholderText } from '../../../../styling/styleUtils';
import { TripReport } from '../../../../types/graphQLTypes';
import {
  convertFieldsToDate,
  notEmpty,
} from '../../../../Utils';
import Modal from '../../../sharedComponents/Modal';
import {
  DateObject,
  getDateType,
} from '../../Utils';
import MountainCompletionModal, {
  ButtonWrapper,
  CancelButton,
  Props as BaseProps,
} from './MountainCompletionModal';

const GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE = gql`
  query tripReportByAuthorDateAndMountain
    ($author: ID!, $mountain: ID!, $date: String!) {
    tripReport: tripReportByAuthorDateAndMountain(
    author: $author, mountain: $mountain, date: $date,) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
        state {
          id
          abbreviation
        }
        elevation
        latitude
        longitude
      }
      users {
        id
        name
      }
      notes
      link
      mudMinor
      mudMajor
      waterSlipperyRocks
      waterOnTrail
      leavesSlippery
      iceBlack
      iceBlue
      iceCrust
      snowIceFrozenGranular
      snowIceMonorailStable
      snowIceMonorailUnstable
      snowIcePostholes
      snowMinor
      snowPackedPowder
      snowUnpackedPowder
      snowDrifts
      snowSticky
      snowSlush
      obstaclesBlowdown
      obstaclesOther
    }
  }
`;

interface SuccessResponse {
  tripReport: TripReport | null;
}

interface QueryVariables {
  author: string;
  mountain: string;
  date: string;
}

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

  const refetchQuery = [
        {query: GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, variables: {
          author: userId, mountain: initialMountainList[0].id, date: stringDate }},
        ];

  const {loading, error, data} = useQuery<SuccessResponse, QueryVariables>(GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, {
    variables: {
      author: userId,
      mountain: initialMountainList[0].id,
      date: stringDate,
    },
  });
  const initialStartDate = date.year && date.month && date.month && date.day
    ? new Date(date.year, date.month - 1, date.day) : null;

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={props.closeEditMountainModalModal} mobileExtend={true}>
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
        onClose={props.closeEditMountainModalModal}
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
        <MountainCompletionModal
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
        />
      );
    } else {
      const {
        id, users, mountains, notes, link,
        mudMinor, mudMajor, waterSlipperyRocks, waterOnTrail, leavesSlippery,
        iceBlack, iceBlue, iceCrust, snowIceFrozenGranular, snowIceMonorailStable,
        snowIceMonorailUnstable, snowIcePostholes, snowMinor, snowPackedPowder,
        snowUnpackedPowder, snowDrifts, snowSticky, snowSlush, obstaclesBlowdown, obstaclesOther,
      } = tripReport;

      const filteredMountains = mountains.filter(notEmpty);
      const filteredUsers = users.filter(notEmpty);

      const userList = filteredUsers.map(user => user.id);
      return (
        <MountainCompletionModal
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
        />
      );
    }
  } else {
    return null;
  }
};

export default EditAscentReport;
