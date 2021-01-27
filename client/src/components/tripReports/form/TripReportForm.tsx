import { faCalendarAlt, faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {validate as validateEmail} from 'email-validator';
import isEqual from 'lodash/isEqual';
import React, { useCallback, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import useBeforeUnload from '../../../hooks/useBeforeUnload';
import useFluent from '../../../hooks/useFluent';
import {
  useTripReportMutations,
} from '../../../queries/tripReports/tripReportMutations';
import {
  GET_LATEST_TRIP_REPORTS_FOR_ITEM,
  nPerPage,
} from '../../../queries/tripReports/useLatestTripReports';
import {addTripReportLink, AddTripReportLinkParams} from '../../../routing/Utils';
import {
  BasicIconInText,
  ButtonPrimary,
  ButtonWarning,
  ButtonWrapper,
  CancelButton,
  FullWidthBreak,
  HighlightedIconInText,
  IconTitle,
  placeholderColor,
  SmallTextNote,
  TitleText,
  warningColor,
} from '../../../styling/styleUtils';
import {
  Conditions,
  PeakListVariants,
  TripReportPrivacy,
} from '../../../types/graphQLTypes';
import { DateType, formatStringDate } from '../../../utilities/dateUtils';
import sendInvites from '../../../utilities/sendInvites';
import {
  convertFieldsToDate,
  isValidURL,
  Seasons,
} from '../../../Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import LoadingDisablePage from '../../sharedComponents/LoadingDisablePage';
import AddFriends from './components/AddFriends';
import AddItems, {CampsiteDatum, MountainDatum, TrailDatum} from './components/AddItems';
import DateWidget, {Restrictions} from './components/DateWidget';
import TripDetails, {
  charLimit,
} from './components/TripDetails';
import {
  ColumnRoot,
  LeftColumn,
  RightColumn,
} from './Utils';

export const preferredDateFormatLocalStorageVariable = 'preferredDateFormatLocalStorageVariable';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-weight: 600;
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 0;

  div {
    font-weight: 400;
  }
`;

const AddAnotherButton = styled(ButtonPrimary)`
  margin-right: 1rem;
`;

const Icon = styled(BasicIconInText)`
  transform: translateY(2px);
`;

const DeleteButton = styled(ButtonWarning)`
  margin-right: auto;
`;

const Error = styled.p`
  color: ${warningColor};
  text-align: center;
`;

const OptionalSup = styled.sup`
  text-transform: lowercase;
  color: ${placeholderColor};
  margin-left: 0.5rem;
  font-size: 0.6em;
  font-style: italic;
  font-weight: 400;
`;

export enum Origin {
  add = 'add',
  edit = 'edit',
}

interface BaseProps {
  initialMountainList: MountainDatum[];
  initialTrailList: TrailDatum[];
  initialCampsiteList: CampsiteDatum[];
  onClose: () => void;
  onSave: () => void;
  userId: string;
  textNote?: React.ReactElement<any> | null;
  origin?: Origin;
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
  initialPrivacy: TripReportPrivacy;
};

const TripReportForm = (props: PropsWithConditions) => {
  const {
    onClose, onSave, userId, textNote,
    initialCompletionDay, initialCompletionMonth,
    initialCompletionYear, initialStartDate, initialDateType,
    initialUserList, initialConditions, initialTripNotes, initialLink,
    initialMountainList, tripReportId, refetchQuery, initialPrivacy,
    initialTrailList, initialCampsiteList, origin,
  } = props;

  const {push} = useHistory();

  const tripNotesEl = useRef<HTMLTextAreaElement | null>(null);
  const tripLinkEl = useRef<HTMLInputElement | null>(null);

  const initialMountainId = initialMountainList.length && initialMountainList[0].id ?
    initialMountainList[0].id : null;
  const initialCampsiteId = initialCampsiteList.length && initialCampsiteList[0].id ?
    initialCampsiteList[0].id : null;
  const initialTrailId = initialTrailList.length && initialTrailList[0].id ?
    initialTrailList[0].id : null;

  const refetchQueries: Array<{query: any, variables: any}> = initialMountainId !== null ? [{
    query: GET_LATEST_TRIP_REPORTS_FOR_ITEM,
    variables: {
      mountain: initialMountainId,
      campsite: initialCampsiteId,
      trail: initialTrailId,
      nPerPage,
    },
  }] : [];

  if (refetchQuery !== undefined) {
    refetchQuery.forEach(query => refetchQueries.push(query));
  }

  const {
    removeMountainCompletion,
    removeCampsiteCompletion,
    removeTrailCompletion,
    addEditTripReport,
    deleteTripReport,
  } = useTripReportMutations();

  const [completionDay, setCompletionDay] = useState<string>
    (initialCompletionDay !== null ? initialCompletionDay : '');
  const [completionMonth, setCompletionMonth] = useState<string>
    (initialCompletionMonth !== null ? initialCompletionMonth : '');
  const [completionYear, setCompletionYear] = useState<string>
    (initialCompletionYear !== null
      ? initialCompletionYear
      : initialDateType !== DateType.none ? new Date().getFullYear().toString() : '');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [dateType, setDateType] = useState<DateType>(initialDateType);
  const [emailList, setEmailList] = useState<string[]>(['']);
  const [userList, setUserList] = useState<string[]>(initialUserList);
  const [mountainList, setMountainList] = useState<MountainDatum[]>(initialMountainList);
  const [trailList, setTrailList] = useState<TrailDatum[]>(initialTrailList);
  const [campsiteList, setCampsiteList] = useState<CampsiteDatum[]>(initialCampsiteList);
  const [privacy, setPrivacy] = useState<TripReportPrivacy>(initialPrivacy);
  const [saving, setSaving] = useState<boolean>(false);

  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState<boolean>(false);
  const openAreYouSureModal = useCallback(() => setIsAreYouSureModalOpen(true), []);
  const closeAreYouSureModal = useCallback(() => setIsAreYouSureModalOpen(false), []);

  const [conditions, setConditions] = useState<Conditions>({...initialConditions});

  const checkIfModified = () => {
    if (!saving && !tripReportId && !(completionDay || completionMonth) && !(
        userList.length ||
        initialMountainList.length !== mountainList.length ||
        initialTrailList.length !== trailList.length ||
        initialCampsiteList.length !== campsiteList.length ||
        initialPrivacy !== privacy ||
        (tripNotesEl && tripNotesEl.current && tripNotesEl.current.value) ||
        (tripLinkEl && tripLinkEl.current && tripLinkEl.current.value)
      )) {
      return false;
    }
    return !saving &&
      (
      initialCompletionDay !== completionDay ||
      initialCompletionMonth !== completionMonth ||
      initialCompletionYear !== completionYear ||
      initialDateType !== dateType ||
      initialUserList.length !== userList.length ||
      initialMountainList.length !== mountainList.length ||
      initialTrailList.length !== trailList.length ||
      initialCampsiteList.length !== campsiteList.length ||
      initialPrivacy !== privacy ||
      !isEqual(conditions, initialConditions) ||
      !(tripNotesEl && tripNotesEl.current && tripNotesEl.current.value === initialTripNotes) ||
      !(tripLinkEl && tripLinkEl.current && tripLinkEl.current.value === initialLink)
    ) ? true : false;
  };

  useBeforeUnload(checkIfModified);

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

  const getString = useFluent();

  const validateAndAddMountainCompletion = async (onComplete: () => void) => {
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

      const mountainIds = [...mountainList.map(mtn => mtn.id)];
      const trailIds = [...trailList.map(trail => trail.id)];
      const campsiteIds = [...campsiteList.map(campsite => campsite.id)];
      const initialMountainIds = initialMountainList.map(mtn => mtn.id);
      const initialTrailIds = initialTrailList.map(trail => trail.id);
      const initialCampsiteIds = initialCampsiteList.map(campsite => campsite.id);
      await addEditTripReport({
        variables: {
          id: tripReportId ? tripReportId : null,
          date: completedDate.date,
          author: userId,
          mountains: mountainIds,
          trails: trailIds,
          campsites: campsiteIds,
          users: userList,
          privacy,
          notes: tripNotes,
          link: tripLink,
          originalDate: initialCompletionDate && initialCompletionDate.date ? initialCompletionDate.date : null,
          originalMountains: initialMountainIds,
          originalTrails: initialTrailIds,
          originalCampsites: initialCampsiteIds,
          ...conditions,
        },
      });
      // SEND invites for all mountains to all entered emails
      // mountainName should dynamically adjust based on the number of
      // additional mountains being sent (so that only a single email is sent)
      // Handled by the backend
      if (mountainList.length) {
        let names: string;
        let onlyCamping: boolean = false;
        if (mountainList.length === 1) {
          names = mountainList[0].name;
        } else if (mountainList.length === 2) {
          names = `${mountainList[0].name} and ${mountainList[1].name}`;
        } else if (mountainList.length) {
          names = `${mountainList[0].name}, ${mountainList[1].name} and ${mountainList.length - 2} others`;
        } else if (trailList.length === 1 && trailList[0].name) {
          names = trailList[0].name;
        } else if (trailList.length && trailList[0].name) {
          names = `${trailList[0].name} and ${trailList.length - 1} others`;
        } else if (campsiteList.length === 1 && campsiteList[0].name) {
          names = campsiteList[0].name;
          onlyCamping = true;
        } else if (campsiteList.length && campsiteList[0].name) {
          names = `${campsiteList[0].name} and ${campsiteList.length - 1} others`;
          onlyCamping = true;
        } else {
          names = '';
        }
        sendInvites({
          mountainName: names,
          emailList: emailList.filter(email => email && validateEmail(email)),
          date: completedDate.date,
          camping: onlyCamping,
        });
      }
      onComplete();
    }
    localStorage.setItem(preferredDateFormatLocalStorageVariable, dateType);
  };

  const onLogTripClick = () => validateAndAddMountainCompletion(onSave);
  const onSaveAndAddAnother = () => validateAndAddMountainCompletion(() => {
    const params: AddTripReportLinkParams = {
      notification: 'no',
    };
    const nextDay = new Date(
      parseInt(completionYear, 10),
      parseInt(completionMonth, 10) - 1,
      parseInt(completionDay, 10),
      0, 0, 0, 0);
    nextDay.setDate(nextDay.getDate() + 1);
    const completedDate = convertFieldsToDate(
      nextDay.getDate().toString(),
      (nextDay.getMonth() + 1).toString(),
      nextDay.getFullYear().toString(),
    );
    if (completedDate.date) {
      params.date = completedDate.date;
    }
    if (userList) {
      params.friends = userList;
    }
    push(addTripReportLink(params));
  });

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

    const campsiteIds = [...campsiteList.map(campsite => campsite.id)];
    campsiteIds.forEach(campsite => {
      removeCampsiteCompletion({ variables: {
        userId, campsiteId: campsite, date: dateToDelete,
      }});
    });

    const trailIds = [...trailList.map(trail => trail.id)];
    trailIds.forEach(trail => {
      removeTrailCompletion({ variables: {
        userId, trailId: trail, date: dateToDelete,
      }});
    });

    if (tripReportId) {
      deleteTripReport({variables: {id: tripReportId}});
    }
    onSave();
  };

  const areYouSureModal = isAreYouSureModalOpen === false ? null : (
    <AreYouSureModal
      onConfirm={deleteAscent}
      onCancel={closeAreYouSureModal}
      title={'Confirm delete'}
      text={'Are your sure you want to delete your trip on '
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
      ? 'Edit Your Trip' : 'Log Your Trip';
    dateWidgetVariant = {variant: props.variant};
  } else if (props.variant === PeakListVariants.winter) {
    title = `Log ${Seasons.winter} trip`;
    dateWidgetVariant = {variant: props.variant};
  } else if (props.variant === PeakListVariants.fourSeason) {
    title = ' Log ' + props.season + ' trip';
    dateWidgetVariant = {variant: props.variant, season: props.season};
  } else if (props.variant === PeakListVariants.grid) {
    title = 'Log ' + props.month + ' trip';
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
    } else if (!mountainList.length && !trailList.length && !campsiteList.length) {
      return true;
    }
    return false;
  };

  const deleteAscentButton = (origin !== Origin.add && origin !== undefined) &&
    (tripReportId !== undefined || initialStartDate !== null || origin === Origin.edit) ? (
      <DeleteButton onClick={openAreYouSureModal}>
        <Icon icon={faTrash} />
        {getString('trip-log-delete-trip')}
      </DeleteButton>
    ) : null;

  const addAnotherButton = tripReportId !== undefined ||
    origin === Origin.edit || dateType !== DateType.full
    ? null : (
      <AddAnotherButton
        onClick={onSaveAndAddAnother}
        disabled={isConfirmDisabled()}
      >
        <Icon icon={faPlus} />
        {getString('trip-log-add-another')}
      </AddAnotherButton>
    );

  const saveButtonText =
    tripReportId !== undefined || initialStartDate !== null
      ? getString('global-text-value-save')
      : getString('global-text-value-modal-mark-complete');

  const saveOverlay = saving ? <LoadingDisablePage /> : null;

  return (
    <Root>
      <IconTitle>
        <HighlightedIconInText icon={faCalendarAlt} />
        <TitleText>{title}</TitleText>
      </IconTitle>
      <SectionTitle>
        {getString('mountain-completion-modal-text-details')}*
        <SmallTextNote>
          * {getString('mountain-completion-modal-text-required-text')}
        </SmallTextNote>
      </SectionTitle>
      <ColumnRoot>
        <LeftColumn>
          {dateSelect}
        </LeftColumn>
        <RightColumn>
          <AddItems
            selectedMountains={mountainList}
            setSelectedMountains={setMountainList}
            selectedTrails={trailList}
            setSelectedTrails={setTrailList}
            selectedCampsites={campsiteList}
            setSelectedCampsites={setCampsiteList}
          />
        </RightColumn>
      </ColumnRoot>
      <SectionTitle>
        {getString('mountain-completion-modal-text-people-hiked-with')}
        <OptionalSup>({getString('global-text-value-optional')})</OptionalSup>
      </SectionTitle>
      <AddFriends
        userId={userId}
        emailList={emailList}
        setEmailList={setEmailList}
        userList={userList}
        setUserList={setUserList}
      />
      <FullWidthBreak />
      <SectionTitle>
        {getString('trip-report-title')}
        <OptionalSup>({getString('global-text-value-optional')})</OptionalSup>
        <SmallTextNote>
          {getString('trip-report-privacy-disclaimer')}
        </SmallTextNote>
      </SectionTitle>
      <TripDetails
        conditions={conditions}
        setConditions={setConditions}
        dateType={dateType}
        initialTripNotes={initialTripNotes}
        initialLink={initialLink}
        privacy={privacy}
        setPrivacy={setPrivacy}
        ref={{tripNotesEl, tripLinkEl} as any}
      />
      <ButtonWrapper>
        {deleteAscentButton}
        <CancelButton onClick={onClose}>
          {getString('global-text-value-modal-cancel')}
        </CancelButton>
        {addAnotherButton}
        <ButtonPrimary
          onClick={onLogTripClick}
          disabled={isConfirmDisabled()}
        >
          <Icon icon={faCheck} />
          {saveButtonText}
        </ButtonPrimary>
      </ButtonWrapper>
      {errorNote}
      {textNote}
      {areYouSureModal}
      {saveOverlay}
    </Root>
  );
};

export default TripReportForm;
