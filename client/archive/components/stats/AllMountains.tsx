import { useQuery } from '@apollo/react-hooks';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import noop from 'lodash/noop';
import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  DetailBoxTitle,
  PlaceholderText,
  SelectBox,
} from '../../styling/styleUtils';
import {
  Mountain,
  PeakListVariants,
  User,
} from '../../types/graphQLTypes';
import getCompletionDates, {VariableDate} from '../peakLists/detail/getCompletionDates';
import MountainTable from '../peakLists/detail/MountainTable';
import { getColorScale } from '../peakLists/detail/PeakListDetail';
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
import Map, {MapContainer} from '../sharedComponents/map';
import MapZoomScrollText from '../sharedComponents/map/MapZoomScrollText';
import MountainColorScale from '../sharedComponents/map/MountainColorScale';
import Header from './Header';

const localstorageShowMajorTrailsAllMtnsKey = 'localstorageShowMajorTrailsAllMtnsKey';
const localstorageShowCampsitesAllMtnsKey = 'localstorageShowCampsitesAllMtnsKey';
const localstorageShowYourLocationAllMtnsKey = 'localstorageShowYourLocationAllMtnsKey';
const localstorageShowNearbyMountainsAllMtnsKey = 'localstorageShowNearbyMountainsAllMtnsKey';

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

  const localstorageMajorTrailsVal = localStorage.getItem(localstorageShowMajorTrailsAllMtnsKey);
  const localstorageCampsitesVal = localStorage.getItem(localstorageShowCampsitesAllMtnsKey);
  const localstorageYourLocationVal = localStorage.getItem(localstorageShowYourLocationAllMtnsKey);
  const localstorageOtherMountainsVal = localStorage.getItem(localstorageShowNearbyMountainsAllMtnsKey);
  const defaultMajorTrails = localstorageMajorTrailsVal === 'true' ? true : false;
  const defaultCampsites = localstorageCampsitesVal === 'true' ? true : false;
  const defaultYourLocation = localstorageYourLocationVal === 'true' ? true : false;
  const defaultOtherMountainsOn = localstorageOtherMountainsVal === 'true' ? true : false;

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

      const {
        colorScaleTitle, colorScaleColors, colorScaleSymbols, colorScaleLabels,
      } = getColorScale(type, getFluentString);

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
            {getFluentString('global-text-value-list-type-description', {
              type: PeakListVariants.standard,
            })}
            </option>
            <option value={PeakListVariants.winter}>
            {getFluentString('global-text-value-list-type-description', {
              type: PeakListVariants.winter,
            })}
            </option>
            <option value={PeakListVariants.fourSeason}>
            {getFluentString('global-text-value-list-type-description', {
              type: PeakListVariants.fourSeason,
            })}
            </option>
            <option value={PeakListVariants.grid}>
            {getFluentString('global-text-value-list-type-description', {
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

            <DetailBoxTitle>
              <BasicIconInText icon={faMapMarkedAlt} />
              {getFluentString('map-generic-title')}
              <MapZoomScrollText />
            </DetailBoxTitle>
            <MountainColorScale
              colorScaleColors={colorScaleColors}
              colorScaleSymbols={colorScaleSymbols}
              colorScaleLabels={colorScaleLabels}
              colorScaleTitle={colorScaleTitle}
            />
            <Map
              peakListId={null}
              mountainId={'all'}
              coordinates={allMountainsWithDates}
              highlighted={undefined}
              userId={userId}
              colorScaleColors={colorScaleColors}
              colorScaleSymbols={colorScaleSymbols}
              completedAscents={userMountains}
              showNearbyTrails={true}
              showYourLocation={true}
              showOtherMountains={true}
              showCampsites={true}
              defaultLocationOn={defaultYourLocation}
              defaultMajorTrailsOn={defaultMajorTrails}
              defaultCampsitesOn={defaultCampsites}
              defaultOtherMountainsOn={defaultOtherMountainsOn}
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