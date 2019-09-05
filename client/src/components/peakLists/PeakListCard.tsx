import { sortBy } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { listDetailLink, preventNavigation } from '../../routing/Utils';
import {
  ButtonPrimary,
  Card,
} from '../../styling/styleUtils';
import {
  CompletedMountain,
  Mountain,
  PeakListVariants,
  Region,
  State,
} from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { PeakListDatum } from './ListPeakLists';
import MountainLogo from './mountainLogo';
import { completedPeaks } from './Utils';

const LinkWrapper = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: inherit;
  grid-row: span 3;
  grid-column: span 2;

  &:hover {
    color: inherit;
  }
`;

const Root = styled(Card)`
  display: grid;
  grid-template-columns: 190px 1fr 150px;
  grid-template-rows: 75px auto 75px;
`;

const Title = styled.h1`
  grid-column: 2;
  grid-row: 1;
`;

const ActionButtonContainer = styled.div`
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

const LogoContainer = styled.div`
  grid-row: 1 / span 3;
  grid-column: 1;
`;

interface RegionDatum {
  id: Region['id'];
  name: Region['name'];
  states: Array<{
    id: State['id'],
  }>;
}

interface StateDatum {
  id: State['id'];
  name: State['name'];
  regions: RegionDatum[];
}

export interface MountainList {
  id: Mountain['id'];
  state: StateDatum;
}

export const getStatesOrRegion = (mountains: MountainList[]) => {
  // If there are 3 or less states, just show the states
  const statesArray: StateDatum[] = [];
  mountains.forEach(({state}) => {
    if (statesArray.filter(({id}) => id === state.id).length === 0) {
      statesArray.push(state);
    }
  });
  if (statesArray.length === 1) {
    return statesArray[0].name;
  } else if (statesArray.length === 2) {
    return statesArray[0].name + ' & ' + statesArray[1].name;
  } else if (statesArray.length === 3) {
    return statesArray[0].name + ', ' + statesArray[1].name + ' & ' + statesArray[2].name;
  } else if (statesArray.length > 2) {
    const regionsArray: RegionDatum[] = [];
    statesArray.forEach(({regions}) => {
      regions.forEach(region => {
        if (regionsArray.filter(({id}) => id === region.id).length === 0) {
          regionsArray.push(region);
        }
      });
    });
    // Else if they all belong to the same region, show that region
    if (regionsArray.length === 0) {
      return null;
    } else if (regionsArray.length === 1) {
      return regionsArray[0].name;
    } else {
      const inclusiveRegions = regionsArray.filter(
        (region) => statesArray.every(({regions}) => regions.includes(region)));
      if (inclusiveRegions.length === 1) {
        return inclusiveRegions[0].name;
      } else if (inclusiveRegions.length > 1) {
        // If they all belong to more than one region, show the more exclusive one
        const exclusiveRegions = sortBy(regionsArray, ({states}) => states.length );
        return exclusiveRegions[0].name;
      } else if (inclusiveRegions.length === 0) {
        // if there are no inclusive regions
        if (regionsArray.length === 2) {
          // if only 2 regions, show them both
          return regionsArray[0].name + ' & ' + regionsArray[1].name;
        } else if (regionsArray.length === 3) {
          // if only 3 regions, show them all
          return regionsArray[0].name + ', ' + regionsArray[1].name + ' & ' + regionsArray[2].name;
        } else {
          // otherwise just say Across the US
          return 'Across the US';
        }
      }
    }
  }
  // Else list all the regions
  return null;
};

interface Props {
  peakList: PeakListDatum;
  active: boolean;
  listAction: (peakListId: string) => void;
  actionText: string;
  completedAscents: CompletedMountain[];
  isCurrentUser: boolean;
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, shortName, parent, type}, peakList,
    active, listAction, actionText, completedAscents,
    isCurrentUser,
  } = props;
  let mountains: MountainList[];
  if (parent !== null && parent.mountains !== null) {
    mountains = parent.mountains;
  } else if (peakList.mountains !== null) {
    mountains = peakList.mountains;
  } else {
    mountains = [];
  }
  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    listAction(id);
  };
  const actionButton = active === false || isCurrentUser === false ? (
    <ActionButtonContainer>
      <ButtonPrimary onClick={actionButtonOnClick}>
        {actionText}
      </ButtonPrimary>
    </ActionButtonContainer> ) : null;

  const numCompletedAscents = completedPeaks(mountains, completedAscents, type);
  let totalRequiredAscents: number;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    totalRequiredAscents = mountains.length;
  } else if (type === PeakListVariants.fourSeason) {
    totalRequiredAscents = mountains.length * 4;
  } else if (type === PeakListVariants.grid) {
    totalRequiredAscents = mountains.length * 12;
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
    totalRequiredAscents = 0;
  }
  const peakCount = active === false
    ? `${totalRequiredAscents} Total Ascents`
    : `${numCompletedAscents}/${totalRequiredAscents} Completed Ascents`;
  return (
    <LinkWrapper to={listDetailLink(id)}>
      <Root>
        <Title>
          {name}
        </Title>
        <ListInfo>
          <span>
            {peakCount}
          </span>
          <span>
            {getStatesOrRegion(mountains)}
          </span>
        </ListInfo>
        <LogoContainer>
          <MountainLogo
            id={id}
            title={name}
            shortName={shortName}
            variant={type}
          />
        </LogoContainer>
        {actionButton}
      </Root>
    </LinkWrapper>
  );
};

export default PeakListCard;
