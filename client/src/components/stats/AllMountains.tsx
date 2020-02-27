import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  PlaceholderText,
  SectionTitleH3,
  SelectBox,
} from '../../styling/styleUtils';
import {
  Mountain,
  PeakListVariants,
  User,
} from '../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
} from '../../Utils';
import getCompletionDates, {VariableDate} from '../peakLists/detail/getCompletionDates';
import MountainTable from '../peakLists/detail/MountainTable';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import Map from '../sharedComponents/map';
import {
  fiveColorScale,
  thirteenColorScale,
  twoColorScale,
} from '../sharedComponents/map/colorScaleColors';

const Subtitle = styled.small`
  display: block;
  text-transform: capitalize;
  margin-top: 0.3rem;
`;

const SelectBoxContiner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-column-gap: 1rem;
`;

const GET_ALL_USERS_MOUNTAINS = gql`
  query GetUsersMountains($userId: ID!) {
    user(id: $userId) {
      id
      mountains {
        mountain {
          id
          name
          latitude
          longitude
          elevation
          state {
            id
            abbreviation
          }
        }
        dates
      }
      allInProgressMountains {
        id
        name
        latitude
        longitude
        elevation
        state {
          id
          abbreviation
        }
      }
    }
  }
`;

interface SuccessResponse {
  user: {
    id: User['id'];
    mountains: User['mountains'];
    allInProgressMountains: User['allInProgressMountains'];
  };
}

interface Props {
  userId: string;
}

const AllMountains = (props: Props) => {
  const {userId} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [type, setType] = useState<PeakListVariants>(PeakListVariants.standard);

  const setPeakListType = (val: string) => {
    if (val === PeakListVariants.standard) {
      setType(PeakListVariants.standard);
    } else if (val === PeakListVariants.winter) {
      setType(PeakListVariants.winter);
    } else if (val === PeakListVariants.fourSeason) {
      setType(PeakListVariants.fourSeason);
    } else if (val === PeakListVariants.grid) {
      setType(PeakListVariants.grid);
    } else {
      setType(PeakListVariants.standard);
    }
  };
  const {loading, error, data} = useQuery<SuccessResponse, {userId: string}>(
    GET_ALL_USERS_MOUNTAINS, {
    variables: { userId },
  });

  if (loading === true) {
    return <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    return  (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { user: { allInProgressMountains, mountains } } = data;
    if (!allInProgressMountains) {
      return (
        <PlaceholderText>
          {getFluentString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {

      let colorScaleTitle: string | undefined;
      let colorScaleColors: string[];
      let colorScaleLabels: string[];
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        colorScaleTitle = undefined;
        colorScaleColors = twoColorScale;
        colorScaleLabels = [
          getFluentString('global-text-value-not-done'),
          getFluentString('global-text-value-done'),
        ];
      } else if (type === PeakListVariants.fourSeason) {
        colorScaleTitle = getFluentString('map-number-of-seasons');
        colorScaleColors = fiveColorScale;
        colorScaleLabels = [
          getFluentString('map-no-seasons'),
          getFluentString('map-all-seasons'),
        ];
      } else if (type === PeakListVariants.grid) {
        colorScaleTitle = getFluentString('map-number-of-months');
        colorScaleColors = thirteenColorScale;
        colorScaleLabels = [
          getFluentString('map-no-months'),
          getFluentString('map-all-months'),
        ];
      } else {
        colorScaleTitle = undefined;
        colorScaleColors = [];
        colorScaleLabels = [];
        failIfValidOrNonExhaustive(type, 'Invalid peak list type ' + type);
      }

      const userMountains = mountains ? mountains : [];

      const allMountainsWithDates: Array<Mountain & {completionDates: VariableDate | null}> = [];
      allInProgressMountains.forEach(mountain => {
        if (mountain) {
          const completionDates = getCompletionDates({type, mountain, userMountains});
          allMountainsWithDates.push({...mountain, completionDates});
        }
      });

      const toggleType = allMountainsWithDates.length > 0 ? (
        <SelectBoxContiner>
          <label htmlFor={'select-box-for-peak-list-type-all-mtn-stats'}>
            {getFluentString('stats-showing-ascents-for')}
          </label>
          <SelectBox
            value={`${type}`}
            onChange={e => setPeakListType(e.target.value)}
            id={'select-box-for-peak-list-type-all-mtn-stats'}
          >
            <option value={PeakListVariants.standard}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.standard,
            })}
            </option>
            <option value={PeakListVariants.winter}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.winter,
            })}
            </option>
            <option value={PeakListVariants.fourSeason}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.fourSeason,
            })}
            </option>
            <option value={PeakListVariants.grid}>
            {getFluentString('global-text-value-list-type', {
              type: PeakListVariants.grid,
            })}
            </option>
          </SelectBox>
        </SelectBoxContiner>
      ) : (
        <>
          <p>{getFluentString('stats-mountain-panel-no-mountains-para-1')}</p>
          <p>{getFluentString('stats-mountain-panel-no-mountains-para-2')}</p>
        </>
      );

      const table = allMountainsWithDates.length > 0 ? (
        <MountainTable
          user={{id: userId}}
          mountains={allMountainsWithDates}
          type={type}
          peakListId={null}
          peakListShortName={''}
          showImportExport={true}
          queryRefetchArray={[{
            query: GET_ALL_USERS_MOUNTAINS,
            variables: { userId }},
          ]}
          disallowImports={true}
          disallowExports={true}
        />
      ) : null;

      return (
        <>
          <SectionTitleH3>
            {getFluentString('stats-mountain-panel')}
            <Subtitle>
              {getFluentString('stats-total-mountains', {
                total: allMountainsWithDates.length,
              })}
            </Subtitle>
          </SectionTitleH3>
          {toggleType}
          <Map
            id={null}
            coordinates={allMountainsWithDates}
            highlighted={undefined}
            userId={userId}
            colorScaleTitle={colorScaleTitle}
            colorScaleColors={colorScaleColors}
            colorScaleLabels={colorScaleLabels}
            key={'stats-all-mountains-in-progress-and-complete-key'}
          />
          {table}
        </>
      );
    }
  } else {
    return (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }
};

export default AllMountains;
