import { gql, useQuery } from '@apollo/client';
import noop from 'lodash/noop';
import React, {useState} from 'react';
import styled from 'styled-components';
import useFluent from '../../hooks/useFluent';
import {
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
import LoadingSpinner from '../sharedComponents/LoadingSpinner';
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

  const getString = useFluent();

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
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { user: { allInProgressMountains, mountains } } = data;
    if (!allInProgressMountains) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {

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
            {getString('stats-showing-ascents-for')}
          </label>
          <SelectBox
            value={`${type}`}
            onChange={e => setPeakListType(e.target.value)}
            id={'select-box-for-peak-list-type-all-mtn-stats'}
          >
            <option value={PeakListVariants.standard}>
            {getString('global-text-value-list-type-description', {
              type: PeakListVariants.standard,
            })}
            </option>
            <option value={PeakListVariants.winter}>
            {getString('global-text-value-list-type-description', {
              type: PeakListVariants.winter,
            })}
            </option>
            <option value={PeakListVariants.fourSeason}>
            {getString('global-text-value-list-type-description', {
              type: PeakListVariants.fourSeason,
            })}
            </option>
            <option value={PeakListVariants.grid}>
            {getString('global-text-value-list-type-description', {
              type: PeakListVariants.grid,
            })}
            </option>
          </SelectBox>
        </SelectBoxContiner>
      ) : (
        <>
          <p>{getString('stats-mountain-panel-no-mountains-para-1')}</p>
          <p>{getString('stats-mountain-panel-no-mountains-para-2')}</p>
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
          {table}
        </>
      );
    }
  } else {
    return (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  }
};

export default AllMountains;
