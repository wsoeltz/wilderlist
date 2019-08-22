import React from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  Card,
} from '../../styling/styleUtils';
import { Mountain, Region, State } from '../../types/graphQLTypes';
import { PeakListDatum } from './ListPeakLists';

const Root = styled(Card)`
  display: grid;
  grid-template-columns: 190px 1fr 150px;
  grid-template-rows: 75px auto 75px;
`;

const Title = styled.h1`
  grid-column: 2;
  grid-row: 1;
`;

const BeginListButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: right;
`;

const ListInfo = styled.h3`
  grid-column: 2 / span 2;
  grid-row: 2;
  display: flex;
  justify-content: space-between;
  margin: 0;
`;

interface StateDatum {
  id: State['id'];
  name: State['name'];
  regions: Array<{
    id: Region['id'];
    name: Region['name'];
    states: Array<{
      id: State['id'],
    }>
  }>;
}

interface MountainList {
  id: Mountain['id'];
  state: StateDatum;
}

const getStatesOrRegion = (mountains: MountainList[]) => {
  // If there are 3 or less states, just show the states
  const states: StateDatum[] = [];
  mountains.forEach(({state}) => {
    if (states.filter(({name}) => name === state.name).length === 0) {
      states.push(state);
    }
  });
  if (states.length === 1) {
    return states[0].name;
  }
  // Else if they all belong to the same region, show that region
    // If they all belong to more then one region, show the more exclusive one
  // Else list all the regions
  return <>{mountains[0].state.regions[0].name}</>;
};

interface Props {
  peakList: PeakListDatum;
}

const ListPeakLists = (props: Props) => {
  const {
    peakList,
  } = props;
  return (
    <Root>
      <Title>
        {peakList.name}
      </Title>
      <ListInfo>
        <span>
          {peakList.mountains.length} Peaks
        </span>
        <span>
          {getStatesOrRegion(peakList.mountains)}
        </span>
      </ListInfo>
      <BeginListButtonContainer>
        <ButtonPrimary>
          Begin List
        </ButtonPrimary>
      </BeginListButtonContainer>
    </Root>
  );
};

export default ListPeakLists;
