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
      const conditionsList = Object.keys(report).map(function(key: keyof TripReport) {
        if (isCondition(key) && report[key]) {
          return (
            <div
              key={report.id + key}
            >
              {getFluentString('trip-report-condition-name', {key})}
            </div>
          );
        } else {
          return null;
        }
      });

      const notes = report.notes ? <div>{report.notes}</div> : null;
      const link = report.link ? <a href={report.link}>{report.link}</a> : null;

      return (
        <BasicListItem key={report.id}>
          <div>{report.date}</div>
          <div>{report.author.name}</div>
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
        {getFluentString('local-trails-hiking-project-nearby-route')}
      </ItemTitle>
      {output}
    </VerticalContentItem>  
  );

}

export default TripReports;