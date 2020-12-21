import { gql, useQuery } from '@apollo/client';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import useFluent from '../../../hooks/useFluent';
import { mountainDetailLink, userProfileLink } from '../../../routing/Utils';
import {
  ButtonSecondary,
  CollapsedParagraph,
  GhostButton,
  LinkButton as LinkButtonBase,
  PlaceholderText,
  PreFormattedParagraph,
  SemiBold,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { Conditions, TripReport } from '../../../types/graphQLTypes';
import {
  isValidURL,
  notEmpty,
} from '../../../Utils';
import {
  formatStringDate,
} from '../../peakLists/Utils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {
  BasicListItem,
  BoldLink,
  Condition,
  ExternalLink,
  ItemTitle,
  ReportBody,
  ReportContainer,
  ReportHeader,
  Section,
  SectionTitle,
} from './sharedStyling';
import TripReportModal from './TripReportModal';

const LinkButton = styled(LinkButtonBase)`
  font-weight: ${semiBoldFontBoldWeight};
`;

const ReadFullReportButton = styled(ButtonSecondary)`
  font-size: 0.7rem;
  margin: 0 0.2rem;
  visibility: hidden;
`;

const Text = styled(PreFormattedParagraph)`
  margin: 0;
`;

export const nPerPage = 7;

export const GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN = gql`
  query getLatestTripReportsForMountain($mountain: ID!, $nPerPage: Int!) {
    tripReports: tripReportsForMountain(
    mountain: $mountain, nPerPage: $nPerPage) {
      id
      date
      author {
        id
        name
        hideProfileInSearch
      }
      mountains {
        id
        name
      }
      users {
        id
        name
        hideProfileInSearch
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

export interface SuccessResponse {
  tripReports: TripReport[];
}

interface QueryVariables {
  mountain: string;
  nPerPage: number;
}

export const isCondition = (key: string) => {
  const conditionsObject: Conditions = {
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
  const conditionsKeys = Object.keys(conditionsObject);
  if (conditionsKeys.indexOf(key) !== -1) {
    return true;
  } else {
    return false;
  }
};

interface Props {
  mountainId: string;
  mountainName: string;
  userId: string | null;
}

const TripReports = ({mountainId, mountainName, userId}: Props) => {

  const [fullReport, setFullReport] = useState<TripReport | null>(null);
  const closeFullReport = useCallback(() => setFullReport(null), []);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const loadMoreReports = useCallback(() => setPageNumber(curr => curr + 1), []);

  const getString = useFluent();

  const tripReportModal = fullReport === null ? null : (
    <TripReportModal
      onClose={closeFullReport}
      tripReport={fullReport}
      userId={userId}
    />
  );

  const {loading, error, data} = useQuery<SuccessResponse, QueryVariables>(GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN, {
    variables: { mountain: mountainId, nPerPage: nPerPage * pageNumber },
  });

  let output: React.ReactElement<any> | null;
  if (loading === true) {
    output = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    output = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { tripReports } = data;
    if (tripReports.length) {
      // max character array setup to map to same order as trip report list
      // the first and second reports, n[0] and n[1], should show more characters
      // the rest should show only 250
      const maxCharactersArray = [1000, 500];
      const maxCharactersDefault = 250;
      const reportList = tripReports.map((report, i) => {
        const allConditionsArray: string[] = [];
        const openReport = () => setFullReport(report);
        Object.keys(report).forEach(function(key: string) {
          if (isCondition(key) && report[key as keyof TripReport]) {
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
          allConditionsArray.forEach((condition, j) => {
            if (j === allConditionsArray.length - 2) {
              conditionsText.push(
                <React.Fragment  key={condition + report.id}>
                  <Condition>{condition}</Condition>{' and '}
                </React.Fragment>,
              );
            } else if (j === allConditionsArray.length - 1) {
              conditionsText.push(
                <Condition key={condition + report.id}>{condition}</Condition>,
              );
            } else {
              conditionsText.push(
                <React.Fragment  key={condition + report.id}>
                  <Condition key={condition + report.id}>{condition}</Condition>{', '}
                </React.Fragment>,
              );
            }
          });
          conditionsList = (
            <Section>
              <SectionTitle>{getString('trip-report-conditions-title')}: </SectionTitle>
              <CollapsedParagraph>{conditionsText}</CollapsedParagraph>
            </Section>
          );
        }
        let notes: React.ReactElement<any> | null;
        if (report.notes && report.notes.length) {
          const maxCharacters = i <= 1 ? maxCharactersArray[i] : maxCharactersDefault;
          const text = report.notes.substring(0, maxCharacters);
          const readMoreText = report.notes.length > maxCharacters ? (
            <>
              ...
              [<LinkButton onClick={openReport}>Read More</LinkButton>]
            </>
          ) : null;
          notes = (
            <Section>
              <SectionTitle>
                {getString('trip-report-notes-title')}
              </SectionTitle>
              <Text>
                {text}{readMoreText}
              </Text>
            </Section>
          );
        } else {
          notes = null;
        }

        const filteredMountains = report.mountains.filter(notEmpty);

        let mountainList: React.ReactElement<any> | null;
        if (filteredMountains.length === 0) {
          mountainList = null;
        } else if (filteredMountains.length === 1) {
          mountainList = (
            <Section>
              <SectionTitle>{getString('global-text-value-mountain')}: </SectionTitle>
              <BoldLink to={mountainDetailLink(filteredMountains[0].id)}>{filteredMountains[0].name}</BoldLink>
            </Section>
          );
        } else if (filteredMountains.length === 2) {
          mountainList = (
            <Section>
              <SectionTitle>{getString('global-text-value-mountains')}: </SectionTitle>
              <BoldLink to={mountainDetailLink(filteredMountains[0].id)}>{filteredMountains[0].name}</BoldLink>
              {' and '}
              <BoldLink to={mountainDetailLink(filteredMountains[1].id)}>{filteredMountains[1].name}</BoldLink>
            </Section>
          );
        } else {
          const mountainsText: Array<React.ReactElement<any>> = [];
          filteredMountains.forEach((mountain, index) => {
            if (index === filteredMountains.length - 2) {
              mountainsText.push(
                <React.Fragment  key={mountain.id + report.id}>
                  <BoldLink to={mountainDetailLink(mountain.id)}>{mountain.name}</BoldLink>
                  {' and '}
                </React.Fragment>,
              );
            } else if (index === filteredMountains.length - 1) {
              mountainsText.push(
                <BoldLink to={mountainDetailLink(mountain.id)} key={mountain.id + report.id}>
                  {mountain.name}
                </BoldLink>,
              );
            } else {
              mountainsText.push(
                <BoldLink to={mountainDetailLink(mountain.id)} key={mountain.id + report.id}>
                  {mountain.name + ', '}
                </BoldLink>,
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

        const link = report.link && isValidURL(report.link) ? (
          <Section>
            <SectionTitle>
              {getString('trip-report-external-link-title')}
            </SectionTitle>
            <ExternalLink href={report.link} rel='noopener noreferrer' target='_blank'>{report.link}</ExternalLink>
          </Section>
        ) : null;

        const authorName = report.author !== null && report.author.hideProfileInSearch !== true
          ? report.author.name : getString('global-text-value-generic-user');

        const authorLink = userId !== null && report.author !== null && report.author.hideProfileInSearch !== true
          ? (
            <BoldLink to={userProfileLink(report.author.id)}>
              {authorName}
            </BoldLink>
          ) : <span>{authorName}</span>;
        return (
          <ReportContainer
            key={report.id}
            id={`trip-report-${report.date}`}
            onClick={openReport}
          >
            <ReportHeader>
              <SemiBold>
                {'On '}
                <LinkButton onClick={openReport}>
                  {formatStringDate(report.date)}
                </LinkButton>
                {' by '}
                {authorLink}
              </SemiBold>
              <ReadFullReportButton
                className='read-full-report-button'
                onClick={openReport}
              >
                {getString('trip-report-read-full-report')}
              </ReadFullReportButton>
            </ReportHeader>
            <ReportBody>
              {conditionsList}
              {notes}
              {mountainList}
              {link}
            </ReportBody>
          </ReportContainer>
        );
      });

      const loadMoreButton = tripReports.length === nPerPage * pageNumber ? (
        <GhostButton onClick={loadMoreReports}>
          {getString('trip-reports-load-more-button')}
        </GhostButton>
      ) : null;

      output = (
        <>
          {reportList}
          {loadMoreButton}
        </>
      );
    } else {
      output = (
        <BasicListItem>
          {getString('trip-report-no-reports', {
            'mountain-name': mountainName,
          })}
        </BasicListItem>
      );
    }
  } else {
    output = null;
  }
  return (
    <div id={'trip-reports'}>
      <ItemTitle>
        {getString('trip-reports-title')}
      </ItemTitle>
      {output}
      {tripReportModal}
    </div>
  );

};

export default TripReports;
