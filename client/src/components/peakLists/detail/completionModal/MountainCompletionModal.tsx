import { useMutation, useQuery } from '@apollo/react-hooks';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import uniq from 'lodash/uniq';
import React, { useContext, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  ButtonPrimary,
  ButtonSecondary,
  ButtonWarning,
  InlineTitle,
  InputBase,
  lightBlue,
  lightBorderColor,
  RequiredNote as RequiredNoteBase,
  warningColor,
} from '../../../../styling/styleUtils';
import {
  Conditions,
  FriendStatus,
  PeakListVariants,
} from '../../../../types/graphQLTypes';
import sendInvites from '../../../../utilities/sendInvites';
import {
  asyncForEach,
  convertFieldsToDate,
  isValidURL,
  Seasons,
} from '../../../../Utils';
import {
  GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN,
  nPerPage,
} from '../../../mountains/detail/TripReports';
import AreYouSureModal from '../../../sharedComponents/AreYouSureModal';
import LoadingSpinner from '../../../sharedComponents/LoadingSpinner';
import Modal, {mobileWidth as modalMobileWidth} from '../../../sharedComponents/Modal';
import {
  CLEAR_ASCENT_NOTIFICATION,
  ClearNotificationVariables,
  SuccessResponse as ClearNotificationsSuccess,
} from '../../../sharedComponents/NotificationBar';
import { DateType, formatStringDate } from '../../Utils';
import AdditionalMountains, {MountainDatum} from './AdditionalMountains';
import DateWidget, {Restrictions} from './components/DateWidget';
import {
  ADD_ASCENT_NOTIFICATIONS,
  ADD_MOUNTAIN_COMPLETION,
  ADD_TRIP_REPORT,
  AddTripReportSuccess,
  AddTripReportVariables,
  AscentNotificationsVariables,
  DELETE_TRIP_REPORT,
  DeleteTripReportVariables,
  EDIT_TRIP_REPORT,
  EditTripReportVariables,
  FriendsDatum,
  GET_FRIENDS,
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
  REMOVE_MOUNTAIN_COMPLETION,
} from './queries';

export const preferredDateFormatLocalStorageVariable = 'preferredDateFormatLocalStorageVariable';

const mobileWidth = 400; // in px

const ColumnRoot = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${mobileWidth}px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
`;

const TitleText = styled(InlineTitle)`
  margin: 0 0 1rem;
  text-transform: capitalize;
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

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const RequiredNote = styled(RequiredNoteBase)`
  text-align: right;
`;

export const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;

  @media (max-width: ${modalMobileWidth}px) {
    margin-right: 0;
  }
`;

const DeleteButton = styled(ButtonWarning)`
  margin-right: auto;
`;

const Error = styled.p`
  color: ${warningColor};
  text-align: center;
`;

const NoDateText = styled.p`
  text-align: center;
  font-style: italic;
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

const charLimit = 5000;

interface BaseProps {
  initialMountainList: MountainDatum[];
  closeEditMountainModalModal: () => void;
  userId: string;
  textNote?: React.ReactElement<any> | null;
}

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
  refetchQuery: Array<{query: any, variables: any}> | undefined;
  initialCompletionDay: string | null;
  initialCompletionMonth: string | null;
  initialCompletionYear: string | null ;
  initialStartDate: Date | null;
  initialDateType: DateType;
  initialUserList: string[];
  initialConditions: Conditions;
  initialTripNotes: string;
  initialLink: string;
};

const MountainCompletionModal = (props: PropsWithConditions) => {
  const {
    closeEditMountainModalModal, userId, textNote,
    initialCompletionDay, initialCompletionMonth,
    initialCompletionYear, initialStartDate, initialDateType,
    initialUserList, initialConditions, initialTripNotes, initialLink,
    initialMountainList, tripReportId, refetchQuery,
  } = props;

  const tripNotesEl = useRef<HTMLTextAreaElement | null>(null);
  const tripLinkEl = useRef<HTMLInputElement | null>(null);

  const {loading, error, data} = useQuery<FriendsDatum, {userId: string}>(GET_FRIENDS, {
    variables: { userId },
  });

  const initialMountainId = initialMountainList.length && initialMountainList[0].id ?
    initialMountainList[0].id : null;

  const refetchQueries: Array<{query: any, variables: any}> = [{
    query: GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN,
    variables: { mountain: initialMountainId, nPerPage },
  }];

  if (refetchQuery !== undefined) {
    refetchQuery.forEach(query => refetchQueries.push(query));
  }

  const [addMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(ADD_MOUNTAIN_COMPLETION, {
      refetchQueries: () => [...refetchQueries],
  });
  const [removeMountainCompletion] =
    useMutation<MountainCompletionSuccessResponse, MountainCompletionVariables>(REMOVE_MOUNTAIN_COMPLETION, {
      refetchQueries: () => [...refetchQueries],
  });
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
    (initialCompletionYear !== null ? initialCompletionYear : new Date().getFullYear().toString());
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

  const validateAndAddMountainCompletion = async () => {
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

      const mountainIds = [...mountainList.map(mtn => mtn.id)];
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
      if (mountainList.length) {
        let mountainNames: string = '';
        if (mountainList.length === 1) {
          mountainNames = mountainList[0].name;
        } else if (mountainList.length === 2) {
          mountainNames = `${mountainList[0].name} and ${mountainList[1].name}`;
        } else {
          mountainList.forEach((mtn, i) => {
            if (i === 0) {
              mountainNames = `${mtn.name}, `;
            } else if (i === mountainList.length - 2) {
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
    }
    localStorage.setItem(preferredDateFormatLocalStorageVariable, dateType);
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

    const mountainIds = [...mountainList.map(mtn => mtn.id)];
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

  let title: string;
  let dateSelect: React.ReactElement<any> | null;
  if (props.variant === PeakListVariants.standard) {
    title = tripReportId !== undefined || initialStartDate !== null || initialDateType !== DateType.full
      ? 'Edit Ascent Report' : 'Log Ascent';
    dateSelect = (
      <DateWidget
        variant={props.variant}
        setDates={setDates}
        setDateType={setDateType}
        dateType={dateType}
        setYearOnly={setYearOnly}
        startDate={startDate}
        initialStartDate={initialStartDate}
        completionYear={completionYear}
      />
    );
  } else if (props.variant === PeakListVariants.winter) {
    title = `Log ${Seasons.winter} ascent`;
    dateSelect = (
      <DateWidget
        variant={props.variant}
        setDates={setDates}
        setDateType={setDateType}
        dateType={dateType}
        setYearOnly={setYearOnly}
        startDate={startDate}
        initialStartDate={initialStartDate}
        completionYear={completionYear}
      />
    );
  } else if (props.variant === PeakListVariants.fourSeason) {
    title = ' Log ' + props.season + ' ascent';
    dateSelect = (
      <DateWidget
        variant={props.variant}
        setDates={setDates}
        setDateType={setDateType}
        dateType={dateType}
        setYearOnly={setYearOnly}
        startDate={startDate}
        initialStartDate={initialStartDate}
        completionYear={completionYear}
        season={props.season}
      />
    );
  } else if (props.variant === PeakListVariants.grid) {
    title = 'Log ascent for ' + props.month;
    dateSelect = (
      <DateWidget
        variant={props.variant}
        setDates={setDates}
        setDateType={setDateType}
        dateType={dateType}
        setYearOnly={setYearOnly}
        startDate={startDate}
        initialStartDate={initialStartDate}
        completionYear={completionYear}
        month={props.month}
      />
    );
  } else {
    title = '';
    dateSelect = null;
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
    } else if (!mountainList.length) {
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
        autoComplete={'off'}
      />
    </ReportContent>
  ) : null;

  const deleteAscentButton =
    tripReportId !== undefined || initialStartDate !== null || initialDateType !== DateType.full ? (
      <DeleteButton onClick={() => setIsAreYouSureModalOpen(true)} mobileExtend={true}>
        <BasicIconInText icon={faTrash} />
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
      <CancelButton onClick={closeEditMountainModalModal} mobileExtend={true}>
        {getFluentString('global-text-value-modal-cancel')}
      </CancelButton>
      <ButtonPrimary
        onClick={() => validateAndAddMountainCompletion()}
        disabled={isConfirmDisabled()}
         mobileExtend={true}
      >
        <BasicIconInText icon={faCheck} />
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
        <RequiredNote
          dangerouslySetInnerHTML={{
            __html: getFluentString('global-form-html-required-note'),
          }}
        />
        <ColumnRoot>
          <LeftColumn>
          <TitleText>
            {title}
          </TitleText>
            {dateSelect}
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
                autoComplete={'off'}
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
