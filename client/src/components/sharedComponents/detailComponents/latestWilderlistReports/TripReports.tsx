import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {
  isCondition,
  nPerPage,
  useLatestTripReports,
} from '../../../../queries/tripReports/useLatestTripReports';
import { userProfileLink } from '../../../../routing/Utils';
import {
  BasicListItem,
  BoldLink,
  Condition,
  ExternalLink,
  ReportBody,
  ReportContainer,
  ReportHeader,
  Section,
  SectionTitle,
} from '../../../../styling/sharedContentStyles';
import {
  ButtonSecondary,
  CollapsedParagraph,
  GhostButton,
  LinkButton as LinkButtonBase,
  PlaceholderText,
  PreFormattedParagraph,
  SemiBold,
  semiBoldFontBoldWeight,
} from '../../../../styling/styleUtils';
import { TripReport, TripReportPrivacy } from '../../../../types/graphQLTypes';
import {
  formatStringDate,
} from '../../../../utilities/dateUtils';
import {
  isValidURL,
} from '../../../../Utils';
import LoadingSpinner from '../../LoadingSpinner';
import TripReportModal from './TripReportModal';

const Root = styled.div`
  min-height: 150px;
`;

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

interface Props {
  mountainId: string;
  mountainName: string;
}

const TripReports = ({mountainId, mountainName}: Props) => {

  const [fullReport, setFullReport] = useState<TripReport | null>(null);
  const closeFullReport = useCallback(() => setFullReport(null), []);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const currentUser = useCurrentUser();
  const userId = currentUser ? currentUser._id : null;

  const loadMoreReports = useCallback(() => setPageNumber(curr => curr + 1), []);

  const getString = useFluent();

  const tripReportModal = fullReport === null ? null : (
    <TripReportModal
      onClose={closeFullReport}
      tripReport={fullReport}
      userId={userId}
    />
  );

  const {loading, error, data} = useLatestTripReports(mountainId, pageNumber);

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
      const maxCharactersArray = [2000, 1500];
      const maxCharactersDefault = 500;
      const reportList = tripReports.map((report, i) => {
        if (report && report.privacy && report.privacy !== TripReportPrivacy.Private) {

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

          const link = report.link && isValidURL(report.link) ? (
            <Section>
              <SectionTitle>
                {getString('trip-report-external-link-title')}
              </SectionTitle>
              <ExternalLink href={report.link} rel='noopener noreferrer' target='_blank'>{report.link}</ExternalLink>
            </Section>
          ) : null;

          const authorName = report.privacy !== TripReportPrivacy.Anonymous &&
            report.author !== null && report.author.hideProfileInSearch !== true
              ? report.author.name : getString('global-text-value-generic-user');

          const authorLink = report.privacy !== TripReportPrivacy.Anonymous &&
            userId !== null && report.author !== null && report.author.hideProfileInSearch !== true
              ? (
                <BoldLink to={userProfileLink(report.author.id)}>
                  {authorName}
                </BoldLink>
              ) : <span>{authorName}</span>;
          return (
            <ReportContainer
              key={report.id}
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
                {link}
              </ReportBody>
            </ReportContainer>
          );
        } else {
          return null;
        }
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
          <em>
            {getString('trip-report-no-reports', {
              'mountain-name': mountainName,
            })}
          </em>
        </BasicListItem>
      );
    }
  } else {
    output = null;
  }
  return (
    <Root>
      {output}
      {tripReportModal}
    </Root>
  );

};

export default TripReports;
