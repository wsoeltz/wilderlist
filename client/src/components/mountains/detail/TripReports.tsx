import React, {useContext} from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TripReport, Conditions } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import { PlaceholderText } from '../../../styling/styleUtils';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { GetString } from 'fluent-react';
import {
  BasicListItem,
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';
import {
  formatStringDate,
} from '../../peakLists/Utils';

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

interface SuccessResponse {
  tripReports: TripReport[];
}

interface QueryVariables {
  mountain: string;
  nPerPage: number;
}

const isCondition = (key: string) => {
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
  }
  const conditionsKeys = Object.keys(conditionsObject);
  if (conditionsKeys.indexOf(key) !== -1) {
    return true;
  } else {
    return false;
  }
}

interface Props {
  mountainId: string;
}

const TripReports = ({mountainId}: Props) => {

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, QueryVariables>(GET_LATEST_TRIP_REPORTS_FOR_MOUNTAIN, {
    variables: { mountain: mountainId, nPerPage },
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
          <div>
            <strong>Trail Conditions: </strong>
            {allConditionsArray[0]}
          </div>
        );
      } else if (allConditionsArray.length === 2) {
        conditionsList = (
          <div>
            <strong>Trail Conditions: </strong>
            {allConditionsArray[0] + ' and ' + allConditionsArray[1]}
          </div>
        );
      } else {
        let conditionsText = '';
        allConditionsArray.forEach((condition, i) => {
          if (i === allConditionsArray.length - 2) {
            conditionsText += condition + ' and ';
          } else if (i === allConditionsArray.length - 1) {
            conditionsText += condition;
          } else {
            conditionsText += condition + ', ';
          }
        });
        conditionsList = (
          <div>
            <strong>Trail Conditions: </strong>
            {conditionsText}
          </div>
        );
      }

      const notes = report.notes ? (
        <div>
          <strong>
            {getFluentString('trip-report-notes-title')}
          </strong>
          <div>
            {report.notes}
          </div>
        </div>
      ) : null;
      const link = report.link ? <a href={report.link}>{report.link}</a> : null;

      return (
        <BasicListItem key={report.id}>
          <div>
            <strong>
              {formatStringDate(report.date)} by {report.author.name}
            </strong>
          </div>
          {conditionsList}
          {notes}
          {link}
        </BasicListItem>
      );
    });
    console.log(data);
    output = <>{reportList}</>;
  } else {
    output = null;
  }
  return (
    <VerticalContentItem>
      <ItemTitle>
        {getFluentString('trip-reports-title')}
      </ItemTitle>
      {output}
    </VerticalContentItem>
  );

}

export default TripReports;