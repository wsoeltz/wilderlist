import { gql, useQuery } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  Label,
  LabelContainer,
  lightBorderColor,
  SelectBox,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { State } from '../../../types/graphQLTypes';
import LoadingSimple from '../../sharedComponents/LoadingSimple';
import StandardSearch from '../../sharedComponents/StandardSearch';

const Root = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  overflow: hidden;
  transition: all 0.5s ease;
`;

const Container = styled.div`
  padding: 0.5rem;
  background-color: ${tertiaryColor};
  border: solid 1px ${lightBorderColor};
  border-top: none;
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto auto auto;
  grid-column-gap: 0.5rem;
  grid-auto-flow: column;
`;

const LoadingContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
`;

const GET_STATES_LIST = gql`
  query getStatesList {
    states {
      id
      abbreviation
    }
  }
`;

interface SuccessResponse {
  states: Array<{
    id: State['id']
    abbreviation: State['abbreviation'],
  }>;
}

interface Props {
  visible: boolean;
  minElevation: string;
  setMinElevation: (val: string) => void;
  maxElevation: string;
  setMaxElevation: (val: string) => void;
  stateId: string;
  setStateId: (val: string) => void;
}

const AdvancedFilter = (props: Props) => {
  const {
    minElevation, setMinElevation, maxElevation, setMaxElevation,
    stateId, setStateId, visible,
  } = props;

  const getString = useFluent();

  const {loading, error, data} = useQuery<SuccessResponse, never>(GET_STATES_LIST);

  let output: React.ReactElement<any> | null;
  if (loading) {
    output = (
      <Container>
        <LoadingContainer>
          <LoadingSimple />
        </LoadingContainer>
      </Container>
    );
  } else if (error || !data) {
    output = null;
  } else {
    const {states} = data;

    const stateFilterOptions = sortBy(states, ['abbreviation']).map(s => (
      <option value={s.id} key={s.id}>
        {s.abbreviation}
      </option>
    ));
    output = (
      <Container>
        <LabelContainer htmlFor={'create-peak-list-mountain-filter-by-state'}>
          <Label>
            <small>{'State'}</small>
          </Label>
        </LabelContainer>
        <SelectBox
          id={'create-peak-list-mountain-filter-by-state'}
          value={stateId || ''}
          onChange={e => setStateId(e.target.value)}
          placeholder={getString('global-text-value-tier')}
        >
          <option value=''>All</option>
          {stateFilterOptions}
        </SelectBox>
        <LabelContainer>
          <Label>
            <small>{'Min Elevation'}</small>
          </Label>
        </LabelContainer>
        <StandardSearch
          placeholder={''}
          setSearchQuery={setMinElevation}
          focusOnMount={false}
          initialQuery={minElevation}
          noSearchIcon={true}
          type={'number'}
        />
        <LabelContainer>
          <Label>
            <small>{'Max Elevation'}</small>
          </Label>
        </LabelContainer>
        <StandardSearch
          placeholder={''}
          setSearchQuery={setMaxElevation}
          focusOnMount={false}
          initialQuery={maxElevation}
          noSearchIcon={true}
          type={'number'}
        />
      </Container>
    );
  }

  return (
    <Root
      style={{
        height: visible ? '5.5rem' : 0,
      }}
    >
      {output}
    </Root>
  );
};

export default AdvancedFilter;
