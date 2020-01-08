import React, {useContext} from 'react';
import MountainCompletionModal, {
  DateType,
  Props as BaseProps,
  ButtonWrapper,
  CancelButton,
} from './MountainCompletionModal';
import {
  DateObject,
} from '../../Utils';
import {
  convertFieldsToDate,
} from '../../../../Utils';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TripReport } from '../../../../types/graphQLTypes';
import Modal from '../../../sharedComponents/Modal';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import { GetString } from 'fluent-react';
import { PlaceholderText } from '../../../../styling/styleUtils';

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

const getDateType = ({day, month, year}: DateObject) => {
  if (day && month && year) {
    return DateType.full;
  } else if (month && year) {
    return DateType.monthYear;
  } else if (year) {
    return DateType.yearOnly;
  } else {
    return DateType.none;
  }
}

type Props = BaseProps & {
  date: DateObject;
}

const EditAscentReport = (props: Props) => {
  const {editMountainId, userId, date} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const day = date.day.toString();
  const month = date.month.toString();
  const year = date.year.toString();
  const parsedDate = convertFieldsToDate(day, month, year);
  const stringDate = parsedDate.date ? parsedDate.date : 'XXXX-XX-XX-XX-XX';
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
      const userList = users.map(user => user.id);
      const mountainList = mountains.filter(mtn => mtn.id !== props.editMountainId);
      return (
        <MountainCompletionModal
          {...props}
          tripReportId={id}
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
