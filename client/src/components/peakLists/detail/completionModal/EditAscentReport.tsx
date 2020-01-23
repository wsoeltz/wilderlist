import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
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
  const {editMountainId, userId, date} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const day = !isNaN(date.day) ? date.day.toString() : '';
  const month = !isNaN(date.month) ? date.month.toString() : '';
  const year = !isNaN(date.year) ? date.year.toString() : '';
  const parsedDate = convertFieldsToDate(day, month, year);
  const stringDate = parsedDate.date ? parsedDate.date : 'XXXX-XX-XX-XX-XX';

  const refetchQuery = {query: GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, variables: {
        author: userId, mountain: editMountainId, date: stringDate }};

  const {loading, error, data} = useQuery<SuccessResponse, QueryVariables>(GET_TRIP_REPORT_FOR_USER_MOUNTAIN_DATE, {
    variables: {
      author: userId,
      mountain: editMountainId,
      date: stringDate,
    },
  });
  const initialStartDate = date.year && date.month && date.month && date.day
    ? new Date(date.year, date.month - 1, date.day) : null;

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={props.closeEditMountainModalModal}>
        {getFluentString('global-text-value-modal-cancel')}
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
          {getFluentString('global-error-retrieving-data')}
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
          refetchQuery={refetchQuery}
          initialCompletionDay={day}
          initialCompletionMonth={month}
          initialCompletionYear={year}
          initialStartDate={initialStartDate}
          initialDateType={getDateType(date)}
          initialUserList={[]}
          initialMountainList={[]}
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
        date: __unusedDate, author: __unusedAuthor,
        ...conditions
      } = tripReport;

      const filteredMountains = tripReport.mountains.filter(notEmpty);
      const filteredUsers = tripReport.users.filter(notEmpty);

      const userList = filteredUsers.map(user => user.id);
      const mountainList = filteredMountains.filter(mtn => mtn.id !== props.editMountainId);
      return (
        <MountainCompletionModal
          {...props}
          tripReportId={id}
          refetchQuery={refetchQuery}
          initialCompletionDay={day}
          initialCompletionMonth={month}
          initialCompletionYear={year}
          initialStartDate={initialStartDate}
          initialDateType={getDateType(date)}
          initialUserList={userList}
          initialMountainList={mountainList}
          initialConditions={conditions}
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