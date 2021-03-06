import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import { isCondition } from '../../../../queries/tripReports/useLatestTripReports';
import { mountainDetailLink, userProfileLink } from '../../../../routing/Utils';
import {
  BoldLink,
  Condition,
  ExternalLink,
  ReportBody,
  ReportHeader,
  Section,
  SectionTitle,
} from '../../../../styling/sharedContentStyles';
import {
  ButtonSecondary,
  PreFormattedParagraph,
  SemiBold,
} from '../../../../styling/styleUtils';
import {
  TripReport,
  TripReportPrivacy,
} from '../../../../types/graphQLTypes';
import {
  formatStringDate,
} from '../../../../utilities/dateUtils';
import {
  isValidURL,
  notEmpty,
} from '../../../../Utils';
import Modal, {mobileWidth} from '../../../sharedComponents/Modal';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;

  @media(max-width: ${mobileWidth}px) {
    margin-right: 0;
  }
`;

const Title = styled(SemiBold)`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Text = styled(PreFormattedParagraph)`
  margin: 0;
`;

interface Props {
  onClose: () => void;
  tripReport: TripReport;
  userId: string | null;
}

const AreYouSureModal = (props: Props) => {
  const { tripReport, onClose, userId } = props;

  const { author } = tripReport;

  const getString = useFluent();

  const allConditionsArray: string[] = [];
  Object.keys(tripReport).forEach(function(key: string) {
    if (isCondition(key) && tripReport[key as keyof TripReport]) {
      allConditionsArray.push(getString('trip-report-condition-name', {key}));
    }
  });
  let conditionsList: React.ReactElement<any> | null;
  if (allConditionsArray.length === 0) {
    conditionsList = null;
  } else if (allConditionsArray.length === 1) {
    conditionsList = (
      <Section>
        <SectionTitle>{getString('trip-report-conditions-title')}: </SectionTitle>
        <Condition>{allConditionsArray[0]}</Condition>
      </Section>
    );
  } else if (allConditionsArray.length === 2) {
    conditionsList = (
      <Section>
        <SectionTitle>{getString('trip-report-conditions-title')}: </SectionTitle>
        <Condition>{allConditionsArray[0]}</Condition>
        {' and '}
        <Condition>{allConditionsArray[1]}</Condition>
      </Section>
    );
  } else {
    const conditionsText: Array<React.ReactElement<any>> = [];
    allConditionsArray.forEach((condition, i) => {
      if (i === allConditionsArray.length - 2) {
        conditionsText.push(
          <React.Fragment  key={condition + tripReport.id}>
            <Condition>{condition}</Condition>{' and '}
          </React.Fragment>,
        );
      } else if (i === allConditionsArray.length - 1) {
        conditionsText.push(
          <Condition key={condition + tripReport.id}>{condition}</Condition>,
        );
      } else {
        conditionsText.push(
          <React.Fragment  key={condition + tripReport.id}>
            <Condition key={condition + tripReport.id}>{condition}</Condition>{', '}
          </React.Fragment>,
        );
      }
    });
    conditionsList = (
      <Section>
        <SectionTitle>{getString('trip-report-conditions-title')}: </SectionTitle>
        {conditionsText}
      </Section>
    );
  }

  const filteredMountains = tripReport.mountains.filter(notEmpty);

  let mountainList: React.ReactElement<any> | null;
  if (filteredMountains.length === 0) {
    mountainList = null;
  } else if (filteredMountains.length === 1) {
    mountainList = (
      <Section>
        <SectionTitle>{getString('global-text-value-mountain')}: </SectionTitle>
        <Link to={mountainDetailLink(filteredMountains[0].id)}>{filteredMountains[0].name}</Link>
      </Section>
    );
  } else if (filteredMountains.length === 2) {
    mountainList = (
      <Section>
        <SectionTitle>{getString('global-text-value-mountains')}: </SectionTitle>
        <Link to={mountainDetailLink(filteredMountains[0].id)}>{filteredMountains[0].name}</Link>
        {' and '}
        <Link to={mountainDetailLink(filteredMountains[1].id)}>{filteredMountains[1].name}</Link>
      </Section>
    );
  } else {
    const mountainsText: Array<React.ReactElement<any>> = [];
    filteredMountains.forEach((mountain, i) => {
      if (i === filteredMountains.length - 2) {
        mountainsText.push(
          <React.Fragment  key={mountain.id + tripReport.id}>
            <Link to={mountainDetailLink(mountain.id)}>{mountain.name}</Link>
            {' and '}
          </React.Fragment>,
        );
      } else if (i === filteredMountains.length - 1) {
        mountainsText.push(
          <Link to={mountainDetailLink(mountain.id)} key={mountain.id + tripReport.id}>
            {mountain.name}
          </Link>,
        );
      } else {
        mountainsText.push(
          <Link to={mountainDetailLink(mountain.id)} key={mountain.id + tripReport.id}>
            {mountain.name + ', '}
          </Link>,
        );
      }
    });
    mountainList = (
      <Section>
        <SectionTitle>{getString('global-text-value-mountains')}: </SectionTitle>
        {mountainsText}
      </Section>
    );
  }

  const filteredUsers = tripReport.privacy !== TripReportPrivacy.Anonymous
    ? tripReport.users.filter(notEmpty) : [];

  let userList: React.ReactElement<any> | null;
  if (filteredUsers.length === 0) {
    userList = null;
  } else if (filteredUsers.length === 1) {
    userList = (
      <Section>
        <SectionTitle>{getString('trip-report-hiked-with')}: </SectionTitle>
        <Link to={userProfileLink(filteredUsers[0].id)}>
          {filteredUsers[0].name}
        </Link>
      </Section>
    );
  } else if (filteredUsers.length === 2) {
    userList = (
      <Section>
        <SectionTitle>{getString('trip-report-hiked-with')}: </SectionTitle>
        <Link to={userProfileLink(filteredUsers[0].id)}>
          {filteredUsers[0].name}
        </Link>
        {' and '}
        <Link to={userProfileLink(filteredUsers[1].id)}>
          {filteredUsers[1].name}
        </Link>
      </Section>
    );
  } else {
    const usersText: Array<React.ReactElement<any>> = [];
    filteredUsers.forEach((user, i) => {
      if (i === filteredUsers.length - 2) {
        usersText.push(
          <React.Fragment  key={user.id + tripReport.id}>
            <Link to={userProfileLink(user.id)}>
              {user.name}
            </Link>
            {' and '}
          </React.Fragment>,
        );
      } else if (i === filteredUsers.length - 1) {
        usersText.push(
          <React.Fragment key={user.id + tripReport.id}>
            <Link to={userProfileLink(user.id)}>
              {user.name}
            </Link>
          </React.Fragment>,
        );
      } else {
        usersText.push(
          <React.Fragment  key={user.id + tripReport.id}>
            <Link to={userProfileLink(user.id)}>
              {user.name}
            </Link>
            {', '}
          </React.Fragment>,
        );
      }
    });
    userList = (
      <Section>
        <SectionTitle>{getString('trip-report-hiked-with')}: </SectionTitle>
        {usersText}
      </Section>
    );
  }

  let notes: React.ReactElement<any> | null;
  if (tripReport.notes && tripReport.notes.length) {
    notes = (
      <Section>
        <SectionTitle>
          {getString('trip-report-notes-title')}
        </SectionTitle>
        <Text>
          {tripReport.notes}
        </Text>
      </Section>
    );
  } else {
    notes = null;
  }

  const link = tripReport.link && isValidURL(tripReport.link) ? (
    <Section>
      <SectionTitle>
        {getString('trip-report-external-link-title')}
      </SectionTitle>
      <ExternalLink href={tripReport.link} rel='noopener noreferrer' target='_blank'>{tripReport.link}</ExternalLink>
    </Section>
  ) : null;

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={onClose} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
      </CancelButton>
    </ButtonWrapper>
  );

  const authorName = tripReport.privacy !== TripReportPrivacy.Anonymous &&
    author !== null && author.hideProfileInSearch !== true
      ? author.name : getString('global-text-value-generic-user');

  const authorLink = tripReport.privacy !== TripReportPrivacy.Anonymous &&
    userId !== null && author !== null && author.hideProfileInSearch !== true
      ? (
        <BoldLink to={userProfileLink(author.id)}>
          {authorName}
        </BoldLink>
      ) : <span>{authorName}</span>;

  return (
    <Modal
      onClose={onClose}
      width={'600px'}
      height={'auto'}
      actions={actions}
    >
      <ReportHeader>
        <Title>
          {'On '}
          {formatStringDate(tripReport.date)}
          {' by '}
          {authorLink}
        </Title>
      </ReportHeader>
      <ReportBody>
        {conditionsList}
        {mountainList}
        {notes}
        {link}
        {userList}
      </ReportBody>
    </Modal>
  );

};

export default AreYouSureModal;
