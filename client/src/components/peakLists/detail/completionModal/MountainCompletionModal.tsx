import { useMutation, useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import uniq from 'lodash/uniq';
import React, { useContext, useRef, useState } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonWarning,
  GhostButton,
  InputBase,
  lightBlue,
  lightBorderColor,
  warningColor,
} from '../../../../styling/styleUtils';
import {
  Conditions,
  FriendStatus,
  Mountain,
  PeakListVariants,
  TripReport,
  User,
} from '../../../../types/graphQLTypes';
import sendInvites from '../../../../utilities/sendInvites';
import {
  asyncForEach,
  convertFieldsToDate,
  getMonthIndex,
  getSeason,
  isValidURL,
  Months,
  Seasons,
} from '../../../../Utils';
import {
  GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN,
  nPerPage,
} from '../../../mountains/detail/TripReports';
import AreYouSureModal from '../../../sharedComponents/AreYouSureModal';
import LoadingSpinner from '../../../sharedComponents/LoadingSpinner';
import Modal from '../../../sharedComponents/Modal';
import {
  CLEAR_ASCENT_NOTIFICATION,
  ClearNotificationVariables,
  SuccessResponse as ClearNotificationsSuccess,
} from '../../../sharedComponents/NotificationBar';
import { DateType, formatStringDate } from '../../Utils';
import AdditionalMountains, {MountainDatum} from './AdditionalMountains';
import './react-datepicker.custom.css';

const mobileWidth = 400; // in px

const ColumnRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${mobileWidth}px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
`;

const TripReportRoot = styled.div`
  margin-top: 2rem;
`;

const LeftColumn = styled.div`
  padding-right: 1rem;
  grid-column: 1;
  grid-row: 1;

  @media (max-width: ${mobileWidth}px) {
    padding-right: 0;
    grid-row: auto;
  }
`;

const RightColumn = styled.div`
  padding-left: 1rem;
  grid-column: 2;
  grid-row: 1;

  @media (max-width: ${mobileWidth}px) {
    padding-left: 0;
    grid-row: auto;
    grid-column: 1;
  }
`;

const FriendColumn = styled(RightColumn)`
  border-left: 1px solid ${lightBorderColor};
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 2rem;

  @media (max-width: ${mobileWidth}px) {
    margin-top: 2rem;
    padding-left: 0;
    border-left: 0;
  }
`;

const DateInputContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 1rem;

  /* This is necessary as datepicker wraps the datepicker
     in a blank div with no class name that can't be removed */
  div:not([class]) {
    display: flex;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

const DeleteButton = styled(ButtonWarning)`
  margin-right: auto;
`;

const Error = styled.p`
  color: ${warningColor};
  text-align: center;
`;

const HideCalendar = styled.div`
  display: none;
`;

const CalendarHeaderRoot = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`;

const MonthNavBtn = styled.button`
  background-color: transparent;
`;

/* tslint:disable:max-line-length */
const SelectBoxBase = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 1rem;
  padding: 7px;
  border-radius: 0;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;

  &:hover {
    cursor: pointer;
    background-color: #ddd;
  }
`;

const SelectYear = styled(SelectBoxBase)`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding-right: 30px;
`;

const SelectMonth = styled(SelectBoxBase)`
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  padding-right: 25px;
`;
const SelectDateOption = styled.option`
  padding: 4px;
`;

const SelectYearYearOnly = styled(SelectBoxBase)`
  border-radius: 4px;
  max-height: 2.5rem;
`;

const NoDateText = styled.p`
  text-align: center;
  font-style: italic;
`;

const TitleText = styled.h3`
  text-transform: capitalize;
`;

const ToggleTypeButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ToggleTypeButton = styled(GhostButton)`
  width: 100%;

  &.active,
  &:hover {
    background-color: ${lightBlue};
  }
`;

export const CheckboxList = styled.div`
  max-height: 200px;
  margin-top: 1rem;
  overflow: auto;
  list-style: none;
  padding: 0;
  border: 1px solid ${lightBorderColor};
`;

const CheckboxLabel = styled.label`
  display: block;
  padding: 0.5rem;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid ${lightBorderColor};
  }

  &:hover {
    cursor: pointer;
    background-color: ${lightBlue};
  }
`;

const SectionTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 0.2rem;
  font-size: 0.8rem;
`;

const Input = styled(InputBase)`
  margin-top: 1rem;
  margin-bottom: 0.6rem;
`;

const AddEmailButton = styled(ButtonPrimary)`
  width: 100%;
`;

const Checkbox = styled.input`
  margin-right: 1rem;
`;

const RemoveIcon = styled.div`
  margin-left: auto;
`;

const ReportContent = styled.div`
  margin-top: 1.6rem;
`;

const ReportTextarea = styled.textarea`
  margin: 1rem 0;
  padding: 8px;
  box-sizing: border-box;
  border: solid 1px #dcdcdc;
  font-size: 1rem;
  font-weight: 200;
  width: 100%;
  min-height: 6rem;
  line-height: 1.4;
`;

const GET_FRIENDS = gql`
  query getFriends($userId: ID) {
    user(id: $userId) {
      id
      friends {
        user {
          id
          name
        }
        status
      }
    }
  }
`;

interface FriendsDatum {
  user: {
    id: User['id'];
    friends: User['friends'];
  };
}

export const ADD_MOUNTAIN_COMPLETION = gql`
  mutation addMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    addMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

const REMOVE_MOUNTAIN_COMPLETION = gql`
  mutation removeMountainCompletion(
    $userId: ID!,
    $mountainId: ID!,
    $date: String!
    ) {
    removeMountainCompletion(
      userId: $userId,
      mountainId: $mountainId,
      date: $date
    ) {
      id
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface MountainCompletionSuccessResponse {
  id: User['id'];
  mountains: User['mountains'];
}

export interface MountainCompletionVariables {
  userId: string;
  mountainId: string;
  date: string;
}

const ADD_ASCENT_NOTIFICATIONS = gql`
  mutation addAscentNotifications(
    $userId: ID!,
    $friendId: ID!,
    $mountainIds: [ID],
    $date: String!
    ) {
    addAscentNotifications(
      userId: $userId,
      friendId: $friendId,
      mountainIds: $mountainIds,
      date: $date
    ) {
      id
    }
  }
`;

interface AscentNotificationsVariables {
  userId: string;
  mountainIds: string[];
  date: string;
  friendId: string;
}

const addTripReportVariableDeclerations = `
  $date: String!,
  $author: ID!,
  $mountains: [ID],
  $users: [ID],
  $notes: String,
  $link: String,
  $mudMinor: Boolean,
  $mudMajor: Boolean,
  $waterSlipperyRocks: Boolean,
  $waterOnTrail: Boolean,
  $leavesSlippery: Boolean,
  $iceBlack: Boolean,
  $iceBlue: Boolean,
  $iceCrust: Boolean,
  $snowIceFrozenGranular: Boolean,
  $snowIceMonorailStable: Boolean,
  $snowIceMonorailUnstable: Boolean,
  $snowIcePostholes: Boolean,
  $snowMinor: Boolean,
  $snowPackedPowder: Boolean,
  $snowUnpackedPowder: Boolean,
  $snowDrifts: Boolean,
  $snowSticky: Boolean,
  $snowSlush: Boolean,
  $obstaclesBlowdown: Boolean,
  $obstaclesOther: Boolean,
`;
const addTripReportVariableParameters = `
  date: $date,
  author: $author,
  mountains: $mountains,
  users: $users,
  notes: $notes,
  link: $link,
  mudMinor: $mudMinor,
  mudMajor: $mudMajor,
  waterSlipperyRocks: $waterSlipperyRocks,
  waterOnTrail: $waterOnTrail,
  leavesSlippery: $leavesSlippery,
  iceBlack: $iceBlack,
  iceBlue: $iceBlue,
  iceCrust: $iceCrust,
  snowIceFrozenGranular: $snowIceFrozenGranular,
  snowIceMonorailStable: $snowIceMonorailStable,
  snowIceMonorailUnstable: $snowIceMonorailUnstable,
  snowIcePostholes: $snowIcePostholes,
  snowMinor: $snowMinor,
  snowPackedPowder: $snowPackedPowder,
  snowUnpackedPowder: $snowUnpackedPowder,
  snowDrifts: $snowDrifts,
  snowSticky: $snowSticky,
  snowSlush: $snowSlush,
  obstaclesBlowdown: $obstaclesBlowdown,
  obstaclesOther: $obstaclesOther,
`;

const ADD_TRIP_REPORT = gql`
  mutation addTripReport( ${addTripReportVariableDeclerations} ) {
    tripReport: addTripReport( ${addTripReportVariableParameters} ) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
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

interface AddTripReportVariables {
  date: TripReport['date'];
  author: string;
  mountains: string[];
  users: string[];
  notes: TripReport['notes'];
  link: TripReport['link'];
  mudMinor: TripReport['mudMinor'];
  mudMajor: TripReport['mudMajor'];
  waterSlipperyRocks: TripReport['waterSlipperyRocks'];
  waterOnTrail: TripReport['waterOnTrail'];
  leavesSlippery: TripReport['leavesSlippery'];
  iceBlack: TripReport['iceBlack'];
  iceBlue: TripReport['iceBlue'];
  iceCrust: TripReport['iceCrust'];
  snowIceFrozenGranular: TripReport['snowIceFrozenGranular'];
  snowIceMonorailStable: TripReport['snowIceMonorailStable'];
  snowIceMonorailUnstable: TripReport['snowIceMonorailUnstable'];
  snowIcePostholes: TripReport['snowIcePostholes'];
  snowMinor: TripReport['snowMinor'];
  snowPackedPowder: TripReport['snowPackedPowder'];
  snowUnpackedPowder: TripReport['snowUnpackedPowder'];
  snowDrifts: TripReport['snowDrifts'];
  snowSticky: TripReport['snowSticky'];
  snowSlush: TripReport['snowSlush'];
  obstaclesBlowdown: TripReport['obstaclesBlowdown'];
  obstaclesOther: TripReport['obstaclesOther'];
}
interface AddTripReportSuccess {
  tripReport: TripReport;
}

const EDIT_TRIP_REPORT = gql`
  mutation editTripReport( $id: ID!, ${addTripReportVariableDeclerations} ) {
    tripReport: editTripReport( id: $id, ${addTripReportVariableParameters} ) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
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

interface EditTripReportVariables extends AddTripReportVariables {
  id: TripReport['id'];
}

const DELETE_TRIP_REPORT = gql`
  mutation deleteTripReport($id: ID!) {
    tripReport: deleteTripReport(id: $id) {
      id
      date
      author {
        id
        name
      }
      mountains {
        id
        name
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

interface DeleteTripReportVariables {
  id: TripReport['id'];
}

const charLimit = 5000;

interface BaseProps {
  editMountainId: string;
  mountainName: string;
  closeEditMountainModalModal: () => void;
  userId: string;
  textNote?: React.ReactElement<any> | null;
}

type Restrictions = {
  variant: PeakListVariants.standard;
} | {
  variant: PeakListVariants.winter;
} | {
  variant: PeakListVariants.fourSeason;
  season: Seasons;
} | {
  variant: PeakListVariants.grid;
  month: Months;
};

const nullConditions: Conditions = {
  mudMinor: null,
  mudMajor: null,
  waterSlipperyRocks: null,
  waterOnTrail: null,
  leavesSlippery: null,
  iceBlack: null,
  iceBlue: null,
  iceCrust: null,
  snowIceFrozenGranular: null,
  snowIceMonorailStable: null,
  snowIceMonorailUnstable: null,
  snowIcePostholes: null,
  snowMinor: null,
  snowPackedPowder: null,
  snowUnpackedPowder: null,
  snowDrifts: null,
  snowSticky: null,
  snowSlush: null,
  obstaclesBlowdown: null,
  obstaclesOther: null,
};

export type Props = BaseProps & Restrictions;

type PropsWithConditions = Props & {
  tripReportId: string | undefined;
  refetchQuery: {query: any, variables: any} | undefined;
  initialCompletionDay: string | null;
  initialCompletionMonth: string | null;
  initialCompletionYear: string | null ;
  initialStartDate: Date | null;
  initialDateType: DateType;
  initialUserList: string[];
  initialConditions: Conditions;
  initialTripNotes: string;
  initialLink: string;
  initialMountainList: Mountain[];
};

const MountainCompletionModal = (props: PropsWithConditions) => {
  const {
    editMountainId, closeEditMountainModalModal, userId, textNote,
    mountainName, initialCompletionDay, initialCompletionMonth,
    initialCompletionYear, initialStartDate, initialDateType,
    initialUserList, initialConditions, initialTripNotes, initialLink,
    initialMountainList, tripReportId, refetchQuery,
  } = props;

  const tripNotesEl = useRef<HTMLTextAreaElement | null>(null);
  const tripLinkEl = useRef<HTMLInputElement | null>(null);

  const {loading, error, data} = useQuery<FriendsDatum, {userId: string}>(GET_FRIENDS, {
    variables: { userId },
  });

  const refetchQueries: Array<{query: any, variables: any}> = [
    {query: GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN, variables: {
    mountain: editMountainId, nPerPage }},
  ];

  if (refetchQuery !== undefined) {
    refetchQueries.push(refetchQuery);
  }

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION);
  const [removeMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION);
  const [addTripReport] =
    useMutation<AddTripReportSuccess, AddTripReportVariables>(ADD_TRIP_REPORT, {
      refetchQueries: () => [...refetchQueries],
  });
  const [editTripReport] =
    useMutation<AddTripReportSuccess, EditTripReportVariables>(EDIT_TRIP_REPORT, {
      refetchQueries: () => [...refetchQueries],
  });
  const [deleteTripReport] =
    useMutation<AddTripReportSuccess, DeleteTripReportVariables>(DELETE_TRIP_REPORT, {
      refetchQueries: () => [...refetchQueries],
  });
  const [addAscentNotifications] =
    useMutation<{id: string}, AscentNotificationsVariables>(ADD_ASCENT_NOTIFICATIONS);

  const [clearAscentNotification] =
    useMutation<ClearNotificationsSuccess, ClearNotificationVariables>(CLEAR_ASCENT_NOTIFICATION);

  const [completionDay, setCompletionDay] = useState<string>
    (initialCompletionDay !== null ? initialCompletionDay : '');
  const [completionMonth, setCompletionMonth] = useState<string>
    (initialCompletionMonth !== null ? initialCompletionMonth : '');
  const [completionYear, setCompletionYear] = useState<string>
    (initialCompletionYear !== null ? initialCompletionYear : '');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [dateType, setDateType] = useState<DateType>(initialDateType);
  const [emailInput, setEmailInput] = useState<string>('');
  const [emailList, setEmailList] = useState<string[]>([]);
  const [userList, setUserList] = useState<string[]>(initialUserList);
  const [mountainList, setMountainList] = useState<MountainDatum[]>(initialMountainList);

  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState<boolean>(false);

  const [conditions, setConditions] = useState<Conditions>({...initialConditions});

  const updateCondition = (key: keyof Conditions) =>
    setConditions({...conditions, [key]: !conditions[key]});

  const updateEmailList = () => {
    if (!emailList.includes(emailInput)) {
      setEmailList([...emailList, emailInput]);
      setEmailInput('');
    }
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.which === 13) {
      updateEmailList();
    }
  };

  const removeEmailFromList = (email: string) => {
    const newEmailList = emailList.filter(e => e !== email);
    setEmailList([...newEmailList]);
  };

  const toggleUserList = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newUserList = [...userList, e.target.value];
      setUserList([...newUserList]);
    } else {
      const newUserList = userList.filter(usedId => usedId !== e.target.value);
      setUserList([...newUserList]);
    }
  };

  const setDates = (date: Date | null) => {
    if (date !== null) {
      const newYear = date.getFullYear();
      const newMonth = date.getMonth() + 1;
      const newDay = date.getDate();
      if (dateType === DateType.full) {
        setCompletionYear(newYear.toString());
        setCompletionMonth(newMonth.toString());
        setCompletionDay(newDay.toString());
      } else if (dateType === DateType.monthYear) {
        setCompletionYear(newYear.toString());
        setCompletionMonth(newMonth.toString());
        setCompletionDay('');
      } else {
        setCompletionYear('');
        setCompletionMonth('');
        setCompletionDay('');
      }
    } else {
      setCompletionYear('');
      setCompletionMonth('');
      setCompletionDay('');
    }
    setStartDate(date);
  };

  const setYearOnly = (year: string) => {
    setCompletionYear(year);
    setCompletionMonth('');
    setCompletionDay('');
  };

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const validateAndAddMountainCompletion = async (mountainId: Mountain['id']) => {
    const completedDate = convertFieldsToDate(completionDay, completionMonth, completionYear);
    const initialCompletionDate =
      initialCompletionDay !== null && initialCompletionMonth !== null && initialCompletionYear !== null
      ? convertFieldsToDate(initialCompletionDay, initialCompletionMonth, initialCompletionYear) : null;
    if (tripLinkEl && tripLinkEl.current && tripLinkEl.current.value.length
      && !isValidURL(tripLinkEl.current.value)) {
      setErrorMessage('Link must be a valid URL that starts with http:// or https://');
    } else if (completedDate.error !== undefined) {
      setErrorMessage(completedDate.error);
    } else {
      setErrorMessage(undefined);
      const tripNotes =
        tripNotesEl && tripNotesEl.current && tripNotesEl.current.value.length
        ? tripNotesEl.current.value.substring(0, charLimit) : null;
      const tripLink =
        tripLinkEl && tripLinkEl.current && tripLinkEl.current.value.length
        ? tripLinkEl.current.value.substring(0, 1000) : null;

      closeEditMountainModalModal();

      const mountainIds = [mountainId, ...mountainList.map(mtn => mtn.id)];
      const initialMountainIds = initialMountainList.map(mtn => mtn.id);
      // remove all dates from all mtns, old and new. dates will be readded to new and existing mtns
      const uniqueAllMountainIds = uniq([...mountainIds, ...initialMountainIds]);
      // if editing and the date has changed from initialCompletionDate, first delete the ascent
      // then add it. This should happen for main mountain as well as all within the
      // mountainList
      if (initialCompletionDate !== null &&
          initialCompletionDate.date !== undefined &&
          initialCompletionDate.date !== completedDate.date) {
        // initial date exists (being edited) and has been changed.
        // DELETE original date
        await asyncForEach(uniqueAllMountainIds, async (mtn: string) => {
          await removeMountainCompletion({ variables: {
            userId, mountainId: mtn, date: initialCompletionDate.date,
          }});
        });
        mountainIds.forEach(mtn => {
          clearAscentNotification({variables: {
            userId, mountainId: mtn, date: initialCompletionDate.date,
          }});
        });
      }
      if (initialDateType === DateType.none && dateType !== DateType.none) {
        // if changing an unknown date to a known date
        await asyncForEach(uniqueAllMountainIds, async (mtn: string) => {
          await removeMountainCompletion({ variables: {
            userId, mountainId: mtn, date: 'XXXX-XX-XX-XX-XX',
          }});
        });
      }
      // mountains may have changed even if date hasn't, so remove mountains from all current date
      await asyncForEach(uniqueAllMountainIds, async (mtn: string) => {
        await removeMountainCompletion({ variables: {
          userId, mountainId: mtn, date: completedDate.date,
        }});
      });
      // regardless of above outcome, add the date. Duplicate dates are ignored.
      mountainIds.forEach(mtn => {
        addMountainCompletion({ variables:
          {userId, mountainId: mtn, date: completedDate.date},
        });
        clearAscentNotification({variables: {
          userId, mountainId: mtn, date: completedDate.date,
        }});
      });
      // then create a trip report (if no conditions it will be handled on the server)
      if (tripReportId === undefined) {
        // if no tripReportId, add the trip report
        if (dateType === DateType.full) {
          // if there is a full date type, then generate the report with the users settings
          addTripReport({ variables: {
            date: completedDate.date,
            author: userId,
            mountains: mountainIds,
            users: userList,
            notes: tripNotes,
            link: tripLink,
            ...conditions,
          }});
        } else {
          // otherwise only create a report to track additional mountains and users
          // this is to prevent the user from changing conditions/report values,
          // switching to an invalid date format, and submitting
          addTripReport({ variables: {
            date: completedDate.date,
            author: userId,
            mountains: mountainIds,
            users: userList,
            notes: null,
            link: null,
            ...nullConditions,
          }});
        }

      }  else {
        // edit the trip report with tripReportId

        // if no tripReportId, add the trip report
        if (dateType === DateType.full) {
          // if there is a full date type, then edit the report with the users settings
          editTripReport({ variables: {
            id: tripReportId,
            date: completedDate.date,
            author: userId,
            mountains: mountainIds,
            users: userList,
            notes: tripNotes,
            link: tripLink,
            ...conditions,
          }});
        } else {
          editTripReport({ variables: {
            id: tripReportId,
            date: completedDate.date,
            author: userId,
            mountains: mountainIds,
            users: userList,
            notes: null,
            link: null,
            ...nullConditions,
          }});
        }
      }

      // SEND 1 email to each user with all of the mountains names,
      // but add a notification to their account for every mountain
      // selected. Handled by the backend
      userList.forEach(friendId => {
        addAscentNotifications({ variables: {
          userId, friendId, mountainIds, date: completedDate.date,
        }});
      });
      // SEND invites for all mountains to all entered emails
        // mountainName should dynamically adjust based on the number of
        // additional mountains being sent (so that only a single email is sent)
        // Handled by the backend
      let mountainNames: string;
      if (mountainList.length === 0) {
        mountainNames = mountainName;
      } else if (mountainList.length === 1) {
        mountainNames = `${mountainName} and ${mountainList[0].name}`;
      } else {
        mountainNames = mountainName + ', ';
        mountainList.forEach((mtn, i) => {
          if (i === mountainList.length - 2) {
            mountainNames += mtn.name + ' and ';
          } else if (i === mountainList.length - 1) {
            mountainNames += mtn.name;
          } else {
            mountainNames += mtn.name + ', ';
          }
        });
      }
      sendInvites({mountainName: mountainNames, emailList, date: completedDate.date});
    }
  };

  const getDateToDelete = () => {
    const initialCompletionDate =
      initialCompletionDay !== null && initialCompletionMonth !== null && initialCompletionYear !== null
      ? convertFieldsToDate(initialCompletionDay, initialCompletionMonth, initialCompletionYear) : null;
    const dateToDelete = initialCompletionDate !== null && initialCompletionDate.date !== undefined
      ? initialCompletionDate.date : 'XXXX-XX-XX-XX-XX';
    return dateToDelete;
  };

  const deleteAscent = () => {
    const dateToDelete = getDateToDelete();

    const mountainIds = [editMountainId, ...mountainList.map(mtn => mtn.id)];
    mountainIds.forEach(mtn => {
      removeMountainCompletion({ variables: {
        userId, mountainId: mtn, date: dateToDelete,
      }});
    });

    if (tripReportId) {
      deleteTripReport({variables: {id: tripReportId}});
    }
    closeEditMountainModalModal();
  };

  const areYouSureModal = isAreYouSureModalOpen === false ? null : (
    <AreYouSureModal
      onConfirm={deleteAscent}
      onCancel={() => setIsAreYouSureModalOpen(false)}
      title={'Confirm delete'}
      text={'Are your sure you want to delete your ascent on '
        + formatStringDate(getDateToDelete()) +
        '? This cannot be undone.'}
      confirmText={'Confirm'}
      cancelText={'Cancel'}
    />
  );

  const errorNote = errorMessage === undefined ? null : <Error>{errorMessage}</Error>;
  const today = new Date();
  const years: number[] = [];
  for (let i = 1900; i < today.getFullYear() + 1; i++) {
    years.push(i);
  }
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const renderCustomHeader: ReactDatePickerProps['renderCustomHeader'] = (dateProps) => {
    const {
      date, changeYear, changeMonth, decreaseMonth,
      increaseMonth,
    } = dateProps;
    const prevMonthButtonDisabled =
      date.getFullYear() === years[0] && date.getMonth() === 0;
    const nextMonthButtonDisabled =
      date.getFullYear() === years[years.length - 1] && date.getMonth() === 11;
    return (
      <CalendarHeaderRoot>
          <MonthNavBtn onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            <FontAwesomeIcon icon='chevron-left' />
          </MonthNavBtn>
          <SelectYear
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}
          >
            {years.map(option => (
              <SelectDateOption key={option} value={option}>
                {option}
              </SelectDateOption>
            ))}
          </SelectYear>

          <SelectMonth
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map(option => (
              <SelectDateOption key={option} value={option}>
                {option}
              </SelectDateOption>
            ))}
          </SelectMonth>

          <MonthNavBtn onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            <FontAwesomeIcon icon='chevron-right' />
          </MonthNavBtn>
        </CalendarHeaderRoot>
    );
  };

  const yearOutOfBounds = (year: number) => year > today.getFullYear();

  let title: string;
  let filterDate: (date: Date) => boolean;
  let initialDate: Date;
  let toggleButtons: React.ReactElement<any> | null = null;
  if (props.variant === PeakListVariants.standard) {
    title = mountainName;
    initialDate = today;
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      return true;
    };
    toggleButtons = (
      <ToggleTypeButtonContainer>
        <ToggleTypeButton
          onClick={() => {
            setDates(null);
            setDateType(DateType.full);
          }}
          className={dateType === DateType.full ? 'active' : ''}
        >
          {getFluentString('mountain-completion-modal-toggle-btn-full-date')}
        </ToggleTypeButton>
        <ToggleTypeButton
          onClick={() => {
            setDates(null);
            setDateType(DateType.monthYear);
          }}
          className={dateType === DateType.monthYear ? 'active' : ''}
        >
          {getFluentString('mountain-completion-modal-toggle-btn-month-year')}
        </ToggleTypeButton>
        <ToggleTypeButton
          onClick={() => {
            setDates(null);
            setYearOnly(new Date().getFullYear().toString());
            setDateType(DateType.yearOnly);
          }}
          className={dateType === DateType.yearOnly ? 'active' : ''}
        >
          {getFluentString('mountain-completion-modal-toggle-btn-year-only')}
        </ToggleTypeButton>
        <ToggleTypeButton
          onClick={() => {
            setDates(null);
            setDateType(DateType.none);
          }}
          className={dateType === DateType.none ? 'active' : ''}
        >
          {getFluentString('mountain-completion-modal-toggle-btn-no-date')}
        </ToggleTypeButton>
      </ToggleTypeButtonContainer>
    );
  } else if (props.variant === PeakListVariants.winter) {
    title = mountainName + ' - ' + Seasons.winter;
    initialDate = new Date(today.getFullYear() - 1, 11);
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const season = getSeason(year, month, day);
      if (season === Seasons.winter) {
        return true;
      }
      return false;
    };
  } else if (props.variant === PeakListVariants.fourSeason) {
    title = mountainName + ' - ' + props.season;
    if (props.season === Seasons.fall) {
      initialDate = new Date(today.getFullYear(), 8);
    } else if (props.season === Seasons.winter) {
      initialDate = new Date(today.getFullYear() - 1, 11);
    } else if (props.season === Seasons.spring) {
      initialDate = new Date(today.getFullYear(), 2);
    } else if (props.season === Seasons.summer) {
      initialDate = new Date(today.getFullYear(), 5);
    } else {
      initialDate = today;
    }
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const season = getSeason(year, month, day);
      if (season === props.season) {
        return true;
      }
      return false;
    };
  } else if (props.variant === PeakListVariants.grid) {
    title = mountainName + ' - ' + props.month;
    const monthIndex = getMonthIndex(props.month);
    initialDate = new Date(today.getFullYear(), monthIndex - 1);
    filterDate = (date: Date) => {
      const year = date.getFullYear();
      if (yearOutOfBounds(year)) {
        return false;
      }
      const month = date.getMonth() + 1;
      if (month === monthIndex) {
        return true;
      }
      return false;
    };
  } else {
    title = mountainName;
    initialDate = today;
    filterDate = () => true;
  }

  let datePickers: React.ReactElement<any> | null;
  if (dateType === DateType.full || dateType === DateType.monthYear) {
    const input = dateType === DateType.monthYear ? null : (
      <DatePicker
        selected={startDate}
        onChange={date => setDates(date)}
        filterDate={filterDate}
        popperContainer={HideCalendar}
        disabledKeyboardNavigation={true}
        isClearable={true}
        placeholderText={'MM/DD/YYYY'}
      />
    );
    datePickers = (
      <>
        {input}
        <DatePicker
          selected={startDate}
          onChange={date => setDates(date)}
          filterDate={filterDate}
          inline={true}
          todayButton={getFluentString('global-text-value-today')}
          showMonthDropdown={true}
          showYearDropdown={true}
          dropdownMode={'select'}
          renderCustomHeader={dateType === DateType.monthYear ? undefined : renderCustomHeader}
          fixedHeight={true}
          calendarClassName={'mountain-completion-modal-datepicker'}
          openToDate={initialStartDate ? initialStartDate : initialDate}
          showMonthYearPicker={dateType === DateType.monthYear}
        />
      </>
    );
  } else if (dateType === DateType.yearOnly) {
    datePickers = (
      <SelectYearYearOnly
        value={completionYear}
        onChange={e => setYearOnly(e.target.value)}
      >
        {years.map(option => (
          <SelectDateOption key={option} value={option}>
            {option}
          </SelectDateOption>
        ))}
      </SelectYearYearOnly>
    );
  } else if (dateType === DateType.none) {
    datePickers = (
      <NoDateText>
        {getFluentString('mountain-completion-modal-no-date')}
      </NoDateText>
    );
  } else {
    datePickers = null;
  }

  let friendsList: React.ReactElement<any> | null;
  if (loading === true) {
    friendsList = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    friendsList =  (
      <NoDateText>
        <small>
          {getFluentString('global-error-retrieving-data')}
        </small>
      </NoDateText>
    );
  } else if (data !== undefined) {
    const { user } = data;
    if (!user) {
      friendsList = (
        <NoDateText>
          <small>
            {getFluentString('global-error-retrieving-data')}
          </small>
        </NoDateText>
      );
    } else {
      const { friends } = user;
      if (friends && friends.length) {
        const friendElements: Array<React.ReactElement<any>> = [];
        friends.forEach(f => {
          if (f.status === FriendStatus.friends && f.user) {
            friendElements.push(
              <CheckboxLabel htmlFor={f.user.id} key={f.user.id}>
                <Checkbox
                  id={f.user.id} type='checkbox'
                  value={f.user.id}
                  checked={userList.indexOf(f.user.id) !== -1}
                  onChange={toggleUserList}
                />
                {f.user.name}
              </CheckboxLabel>,
            );
          }
        });
        if (friendElements.length) {
          friendsList = (
            <CheckboxList>
              {friendElements}
            </CheckboxList>
          );
        } else {
          friendsList = (
            <NoDateText>
              <small>
                {getFluentString('mountain-completion-modal-text-no-friends-yet')}
              </small>
            </NoDateText>
          );
        }
      } else {
        friendsList = (
          <NoDateText>
            <small>
              {getFluentString('mountain-completion-modal-text-no-friends-yet')}
            </small>
          </NoDateText>
        );
      }
    }
  } else {
    friendsList = null;
  }

  const isConfirmDisabled = () => {
    if (dateType === DateType.full &&
      (completionDay === '' || completionMonth === '' || completionYear === '')) {
      return true;
    } else if (dateType === DateType.monthYear &&
      (completionDay !== '' || completionMonth === '' || completionYear === '')) {
      return true;
    } else if (dateType === DateType.yearOnly &&
      (completionDay !== '' || completionMonth !== '' || completionYear === '')) {
      return true;
    } else if (dateType === DateType.none &&
      (completionDay !== '' || completionMonth !== '' || completionYear !== '')) {
      return true;
    }
    return false;
  };

  const emailListItems = emailList.map((email, i) => (
    <CheckboxLabel
      key={email + i}
      onClick={() => removeEmailFromList(email)}
    >
      {email}
      <RemoveIcon>×</RemoveIcon>
    </CheckboxLabel>
  ));
  const emailListElement = emailListItems.length ? (
    <CheckboxList>
      {emailListItems}
    </CheckboxList>
  ) : null;

  // use nullConditions keys as it is defined to always be the same as the
  // interface Conditions, whereas the prop conditions could recieve unknown
  // keys from the database (such as __typename)
  const conditionsListItems = Object.keys(nullConditions).map(function(key: keyof Conditions) {
    return (
      <CheckboxLabel
        htmlFor={`${key}-condition-checkbox`}
        key={key}
      >
        <Checkbox
          id={`${key}-condition-checkbox`} type='checkbox'
          checked={conditions[key] ? true : false}
          onChange={() => updateCondition(key)}
        />
        {getFluentString('trip-report-condition-name', {key})}
      </CheckboxLabel>
    );
  });

  const conditionsList = dateType === DateType.full ? (
    <CheckboxList>
      {conditionsListItems}
    </CheckboxList>
  ) : (
    <small>
      {getFluentString('trip-report-invalid-date-format')}
    </small>
  );

  const reportContent = dateType === DateType.full ? (
    <ReportContent>
      <SectionTitle>{getFluentString('trip-report-notes-title')}</SectionTitle>
      <ReportTextarea
        placeholder={getFluentString('trip-report-notes-placeholder')}
        defaultValue={initialTripNotes}
        ref={tripNotesEl}
        maxLength={charLimit}
      />
      <SectionTitle>{getFluentString('trip-report-link-title')}</SectionTitle>
      <Input
        type='text'
        placeholder={getFluentString('trip-report-link-placeholder')}
        defaultValue={initialLink}
        ref={tripLinkEl}
        maxLength={1000}
      />
    </ReportContent>
  ) : null;

  const deleteAscentButton =
    tripReportId !== undefined || initialStartDate !== null || initialDateType !== DateType.full ? (
      <DeleteButton onClick={() => setIsAreYouSureModalOpen(true)}>
        Delete Ascent
      </DeleteButton>
    ) : null;

  const saveButtonText =
    tripReportId !== undefined || initialStartDate !== null || initialDateType !== DateType.full
      ? getFluentString('global-text-value-save')
      : getFluentString('global-text-value-modal-mark-complete');

  const actions = (
    <ButtonWrapper>
      {deleteAscentButton}
      <CancelButton onClick={closeEditMountainModalModal}>
        {getFluentString('global-text-value-modal-cancel')}
      </CancelButton>
      <ButtonPrimary
        onClick={() => validateAndAddMountainCompletion(editMountainId)}
        disabled={isConfirmDisabled()}
      >
        {saveButtonText}
      </ButtonPrimary>
    </ButtonWrapper>
  );

  return (
    <>
      <Modal
        onClose={closeEditMountainModalModal}
        width={'600px'}
        height={'auto'}
        actions={actions}
      >
        <TitleText>{title}</TitleText>
        <ColumnRoot>
          <LeftColumn>
            {toggleButtons}
            <DateInputContainer>
              {datePickers}
            </DateInputContainer>
          </LeftColumn>
          <FriendColumn>
            <div>
              <SectionTitle>
                {getFluentString('mountain-completion-modal-text-add-wilderlist-friends')}
              </SectionTitle>
              {friendsList}
            </div>
            <div>
              <SectionTitle>
                {getFluentString('mountain-completion-modal-text-add-other-friends')}
              </SectionTitle>
              <small>
                {getFluentString('mountain-completion-modal-text-add-other-friends-note')}
              </small>
              <Input
                placeholder={getFluentString('global-text-value-modal-email-address')}
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyPress={onEnterPress}
                maxLength={1000}
              />
              <AddEmailButton
                disabled={emailInput === ''}
                onClick={updateEmailList}
              >
                {getFluentString('mountain-completion-modal-text-add-email-button')}
              </AddEmailButton>
              {emailListElement}
            </div>
          </FriendColumn>
        </ColumnRoot>
        {errorNote}
        {textNote}
        <TripReportRoot>
          <ColumnRoot>
            <RightColumn>
              <SectionTitle>
                {getFluentString('trip-report-add-additional-mtns-title')}
              </SectionTitle>
              <small>
                {getFluentString('trip-report-add-additional-mtns-desc')}
              </small>
              <AdditionalMountains
                targetMountainId={editMountainId}
                selectedMountains={mountainList}
                setSelectedMountains={setMountainList}
              />
            </RightColumn>
            <LeftColumn>
              <SectionTitle>
                {getFluentString('trip-report-conditions-title')}
              </SectionTitle>
              {conditionsList}
            </LeftColumn>
          </ColumnRoot>
          {reportContent}
        </TripReportRoot>
      </Modal>
      {areYouSureModal}
    </>
  );
};

export default MountainCompletionModal;
