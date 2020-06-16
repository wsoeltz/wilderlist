import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import noop from 'lodash/noop';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  PlaceholderText,
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
import Map, {MapContainer} from '../sharedComponents/map';
import {
  fiveColorScale,
  fiveSymbolScale,
  thirteenColorScale,
  thirteenSymbolScale,
  twoColorScale,
  twoSymbolScale,
} from '../sharedComponents/map/colorScaleColors';
import Header from './Header';

const SelectBoxContiner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-column-gap: 1rem;
`;

export const GET_ALL_USERS_MOUNTAINS = gql`
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

  const queryRefetchArray = [{query: GET_ALL_USERS_MOUNTAINS, variables: {userId}}];

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
      let colorScaleSymbols: string[];
      let colorScaleLabels: string[];
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        colorScaleTitle = undefined;
        colorScaleColors = twoColorScale;
        colorScaleSymbols = twoSymbolScale;
        colorScaleLabels = [
          getFluentString('global-text-value-not-done'),
          getFluentString('global-text-value-done'),
        ];
      } else if (type === PeakListVariants.fourSeason) {
        colorScaleTitle = getFluentString('map-number-of-seasons');
        colorScaleColors = fiveColorScale;
        colorScaleSymbols = fiveSymbolScale;
        colorScaleLabels = [
          getFluentString('map-no-seasons'),
          getFluentString('map-all-seasons'),
        ];
      } else if (type === PeakListVariants.grid) {
        colorScaleTitle = getFluentString('map-number-of-months');
        colorScaleColors = thirteenColorScale;
        colorScaleSymbols = thirteenSymbolScale;
        colorScaleLabels = [
          getFluentString('map-no-months'),
          getFluentString('map-all-months'),
        ];
      } else {
        colorScaleTitle = undefined;
        colorScaleColors = [];
        colorScaleSymbols = [];
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
          queryRefetchArray={queryRefetchArray}
          disallowImports={true}
          disallowExports={true}
          isExportModalOpen={false}
          setIsExportModalOpen={noop}
        />
      ) : null;

      return (
        <>
          <Header
            userId={userId}
            mountainCount={allMountainsWithDates.length}
            queryRefetchArray={queryRefetchArray}
          />
          {toggleType}
          <MapContainer>
            <Map
              peakListId={null}
              mountainId={'all'}
              coordinates={allMountainsWithDates}
              highlighted={undefined}
              userId={userId}
              colorScaleTitle={colorScaleTitle}
              colorScaleColors={colorScaleColors}
              colorScaleSymbols={colorScaleSymbols}
              colorScaleLabels={colorScaleLabels}
              completedAscents={userMountains}
              key={'stats-all-mountains-in-progress-and-complete-key'}
            />
          </MapContainer>
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
