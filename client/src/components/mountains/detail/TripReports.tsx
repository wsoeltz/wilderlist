import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { userProfileLink } from '../../../routing/Utils';
import {
  GhostButton,
  LinkButton as LinkButtonBase,
  PlaceholderText,
  SemiBold,
  semiBoldFontBoldWeight,
} from '../../../styling/styleUtils';
import { Conditions, TripReport } from '../../../types/graphQLTypes';
import {
  isValidURL,
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
  VerticalContentItem,
} from './sharedStyling';
import TripReportModal from './TripReportModal';

const LinkButton = styled(LinkButtonBase)`
  font-weight: ${semiBoldFontBoldWeight};
`;

const ReadFullReportButton = styled(GhostButton)`
  padding-top: 0;
  font-size: 0.7rem;
  margin: 0 0.2rem;
  visibility: hidden;
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
}

const TripReports = ({mountainId, mountainName}: Props) => {

  const [fullReport, setFullReport] = useState<TripReport | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const loadMoreReports = () => setPageNumber(pageNumber + 1);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const tripReportModal = fullReport === null ? null : (
    <TripReportModal
      onClose={() => setFullReport(null)}
      tripReport={fullReport}
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
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { tripReports } = data;
    if (tripReports.length) {

      const reportList = tripReports.map(report => {
        const allConditionsArray: string[] = [];
        Object.keys(report).forEach(function(key: keyof TripReport) {
          if (isCondition(key) && report[key]) {
            allConditionsArray.push(getFluentString('trip-report-condition-name', {key}));
          }
        });
        let conditionsList: React.ReactElement<any> | null;
        if (allConditionsArray.length === 0) {
          conditionsList = null;
        } else if (allConditionsArray.length === 1) {
          conditionsList = (
            <Section>
              <SectionTitle>{getFluentString('trip-report-conditions-title')}: </SectionTitle>
              <Condition>{allConditionsArray[0]}</Condition>
            </Section>
          );
        } else if (allConditionsArray.length === 2) {
          conditionsList = (
            <Section>
              <SectionTitle>{getFluentString('trip-report-conditions-title')}: </SectionTitle>
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
                <React.Fragment  key={condition + report.id}>
                  <Condition>{condition}</Condition>{' and '}
                </React.Fragment>,
              );
            } else if (i === allConditionsArray.length - 1) {
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
              <SectionTitle>{getFluentString('trip-report-conditions-title')}: </SectionTitle>
              {conditionsText}
            </Section>
          );
        }
        const maxCharacters = 250;
        let notes: React.ReactElement<any> | null;
        if (report.notes && report.notes.length) {
          const text = report.notes.substring(0, maxCharacters);
          const readMoreText = report.notes.length > maxCharacters ? (
            <>
              ...
              [<LinkButton onClick={() => setFullReport(report)}>Read More</LinkButton>]
            </>
          ) : null;
          notes = (
            <Section>
              <SectionTitle>
                {getFluentString('trip-report-notes-title')}
              </SectionTitle>
              <div>
                {text}{readMoreText}
              </div>
            </Section>
          );
        } else {
          notes = null;
        }

        const link = report.link && isValidURL(report.link) ? (
          <Section>
            <SectionTitle>
              {getFluentString('trip-report-external-link-title')}
            </SectionTitle>
            <ExternalLink href={report.link} rel='noopener noreferrer' target='_blank'>{report.link}</ExternalLink>
          </Section>
        ) : null;

        const authorName = report.author !== null ? (
          <BoldLink to={userProfileLink(report.author.id)}>
            {report.author.name}
          </BoldLink>
        ) : (
          <span>{getFluentString('global-text-value-generic-user')}</span>
        );

        return (
          <ReportContainer key={report.id}>
            <ReportHeader>
              <SemiBold>
                {'On '}
                <LinkButton onClick={() => setFullReport(report)}>
                  {formatStringDate(report.date)}
                </LinkButton>
                {' by '}
                {authorName}
              </SemiBold>
              <ReadFullReportButton
                className='read-full-report-button'
                onClick={() => setFullReport(report)}
              >
                {getFluentString('trip-report-read-full-report')}
              </ReadFullReportButton>
            </ReportHeader>
            <ReportBody>
              {conditionsList}
              {notes}
              {link}
            </ReportBody>
          </ReportContainer>
        );
      });

      const loadMoreButton = tripReports.length === nPerPage * pageNumber ? (
        <GhostButton onClick={loadMoreReports}>
          {getFluentString('trip-reports-load-more-button')}
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
          {getFluentString('trip-report-no-reports', {
            'mountain-name': mountainName,
          })}
        </BasicListItem>
      );
    }
  } else {
    output = null;
  }
  return (
    <VerticalContentItem>
      <ItemTitle>
        {getFluentString('trip-reports-title')}
      </ItemTitle>
      {output}
      {tripReportModal}
    </VerticalContentItem>
  );

};

export default TripReports;
