import { useMutation } from '@apollo/client';
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
  warningColor,
} from '../../../../styling/styleUtils';
import {
  Conditions,
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
import LoadingDisablePage from '../../../sharedComponents/LoadingDisablePage';
import Modal, {mobileWidth as modalMobileWidth} from '../../../sharedComponents/Modal';
import {
  CLEAR_ASCENT_NOTIFICATION,
  ClearNotificationVariables,
  SuccessResponse as ClearNotificationsSuccess,
} from '../../../sharedComponents/NotificationBar';
import { DateType, formatStringDate } from '../../Utils';
import AddFriends from './components/AddFriends';
import AddMountains, {MountainDatum} from './components/AddMountains';
import DateWidget, {Restrictions} from './components/DateWidget';
import TripDetails, {charLimit, nullConditions} from './components/TripDetails';
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
  MountainCompletionSuccessResponse,
  MountainCompletionVariables,
  REMOVE_MOUNTAIN_COMPLETION,
} from './queries';
import {
  ColumnRoot,
  LeftColumn,
  RightColumn,
} from './Utils';

export const preferredDateFormatLocalStorageVariable = 'preferredDateFormatLocalStorageVariable';

const TitleText = styled(InlineTitle)`
  margin: 0 0 1rem;
  text-transform: capitalize;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

interface BaseProps {
  initialMountainList: MountainDatum[];
  closeEditMountainModalModal: () => void;
  userId: string;
  textNote?: React.ReactElement<any> | null;
}

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

  const initialMountainId = initialMountainList.length && initialMountainList[0].id ?
    initialMountainList[0].id : null;

  const refetchQueries: Array<{query: any, variables: any}> = initialMountainId !== null ? [{
    query: GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN,
    variables: { mountain: initialMountainId, nPerPage },
  }] : [];

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
  const [emailList, setEmailList] = useState<string[]>([]);
  const [userList, setUserList] = useState<string[]>(initialUserList);
  const [mountainList, setMountainList] = useState<MountainDatum[]>(initialMountainList);
  const [saving, setSaving] = useState<boolean>(false);

  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState<boolean>(false);

  const [conditions, setConditions] = useState<Conditions>({...initialConditions});

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
    setSaving(true);
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

      // closeEditMountainModalModal();

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
      closeEditMountainModalModal();
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
  let dateWidgetVariant: Restrictions | undefined;
  if (props.variant === PeakListVariants.standard) {
    title = tripReportId !== undefined || initialStartDate !== null || initialDateType !== DateType.full
      ? 'Edit Ascent Report' : 'Log Ascent';
    dateWidgetVariant = {variant: props.variant};
  } else if (props.variant === PeakListVariants.winter) {
    title = `Log ${Seasons.winter} ascent`;
    dateWidgetVariant = {variant: props.variant};
  } else if (props.variant === PeakListVariants.fourSeason) {
    title = ' Log ' + props.season + ' ascent';
    dateWidgetVariant = {variant: props.variant, season: props.season};
  } else if (props.variant === PeakListVariants.grid) {
    title = 'Log ascent for ' + props.month;
    dateWidgetVariant = {variant: props.variant, month: props.month};
  } else {
    title = '';
    dateWidgetVariant = undefined;
  }

  const dateSelect = dateWidgetVariant !== undefined ? (
    <DateWidget
      {...dateWidgetVariant}
      setDates={setDates}
      setDateType={setDateType}
      dateType={dateType}
      setYearOnly={setYearOnly}
      startDate={startDate}
      initialStartDate={initialStartDate}
      completionYear={completionYear}
    />
  ) : null;

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

  const saveOverlay = saving ? <LoadingDisablePage /> : null;

  return (
    <>
      <Modal
        onClose={closeEditMountainModalModal}
        width={'700px'}
        height={'650px'}
        actions={actions}
      >
        <ColumnRoot>
          <LeftColumn>
          <TitleText>
            {title}
          </TitleText>
            {dateSelect}
          </LeftColumn>
          <RightColumn>
            <AddMountains
              selectedMountains={mountainList}
              setSelectedMountains={setMountainList}
            />
            <AddFriends
              userId={userId}
              emailList={emailList}
              setEmailList={setEmailList}
              userList={userList}
              setUserList={setUserList}
            />
            <TripDetails
              conditions={conditions}
              setConditions={setConditions}
              dateType={dateType}
              initialTripNotes={initialTripNotes}
              initialLink={initialLink}
              ref={{tripNotesEl, tripLinkEl} as any}
            />
          </RightColumn>
        </ColumnRoot>
        {errorNote}
        {textNote}
      </Modal>
      {areYouSureModal}
      {saveOverlay}
    </>
  );
};

export default MountainCompletionModal;
