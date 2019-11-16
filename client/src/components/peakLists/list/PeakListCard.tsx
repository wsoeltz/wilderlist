import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import { sortBy } from 'lodash';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  comparePeakListLink,
  listDetailWithMountainDetailLink,
  preventNavigation,
  searchListDetailLink,
} from '../../../routing/Utils';
import {
  boldFontWeight,
  ButtonPrimary,
  Card,
} from '../../../styling/styleUtils';
import {
  CompletedMountain,
  Mountain,
  PeakList,
  Region,
  State,
  User,
} from '../../../types/graphQLTypes';
import { UserContext } from '../../App';
import DynamicLink from '../../sharedComponents/DynamicLink';
import MountainLogo from '../mountainLogo';
import { formatDate, getLatestAscent, getType } from '../Utils';
import { CardPeakListDatum } from './ListPeakLists';
import PeakProgressBar from './PeakProgressBar';

export const GET_STATES_AND_REGIONS = gql`
  query getStatesAndRegions($id: ID!) {
    peakList(id: $id) {
      id
      states {
        id
        name
        regions {
          id
          name
          states {
            id
          }
        }
      }
      mountains {
        id
      }
      parent {
        id
        states {
          id
          name
          regions {
            id
            name
            states {
              id
            }
          }
        }
        mountains {
          id
        }
      }
    }
  }
`;

interface RegionDatum {
  id: Region['id'];
  name: Region['name'];
  states: Array<{
    id: State['id'],
  }>;
}

export interface StateDatum {
  id: State['id'];
  name: State['name'];
  regions: RegionDatum[];
}

export interface SuccessResponse {
  peakList: null | {
    id: PeakList['id'];
    states: null | StateDatum[];
    mountains: null | Array<{
      id: PeakList['id'];
    }>
    parent: null | {
      id: PeakList['id'];
      states: null | StateDatum[];
      mountains: null | Array<{
        id: PeakList['id'];
      }>
    }
  };
}

export interface Variables {
  id: string;
}

const LinkWrapper = styled(DynamicLink)`
  display: block;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
  }
`;

const smallCardBreakpoint = 400; // in px

export const Root = styled(Card)`
  display: grid;
  grid-template-columns: 11.875rem 1fr auto;
  grid-template-rows: auto auto 50px;
  grid-column-gap: 1rem;

  @media(max-width: 600px) {
    grid-template-columns: 8rem 1fr auto;
  }
`;

const TitleBase = styled.h1`
  grid-column: 2;
  grid-row: 1;
`;

export const TitleFull = styled.h1`
  grid-column: 2 / span 2;
  grid-row: 1;
`;

const ActionButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: right;
`;

export const ListInfo = styled.h3`
  grid-column: 2 / span 2;
  grid-row: 2;
  display: flex;
  justify-content: space-between;
  margin: 0;

  @media(max-width: ${smallCardBreakpoint}px) {
    flex-direction: column-reverse;
  }
`;

export const LogoContainer = styled.div`
  grid-row: 1 / span 3;
  grid-column: 1;
`;

export const ProgressBarContainer = styled.div`
  grid-column: 2 / span 2;
  grid-row: 3;
`;

export const TextRight = styled.div`
  text-align: right;
  margin-left: 1rem;

  @media(max-width: ${smallCardBreakpoint}px) {
    margin-left: 0;
    margin-bottom: 0.5rem;
    text-align: left;
  }
`;

export const BigText = styled.span`
  font-size: 1.3rem;
  transform: translateY(0.04rem);
  display: inline-block;
  margin-right: 0.25rem;
  font-weight: ${boldFontWeight};
`;

export const getStatesOrRegion = (statesArray: StateDatum[], getFluentString: GetString) => {
  const sortedStates = sortBy(statesArray, ['name']);
  // If there are 3 or less states, just show the states
  if (sortedStates.length === 1) {
    return sortedStates[0].name;
  } else if (sortedStates.length === 2) {
    return sortedStates[0].name + ' & ' + sortedStates[1].name;
  } else if (sortedStates.length === 3) {
    return sortedStates[0].name + ', ' + sortedStates[1].name + ' & ' + sortedStates[2].name;
  } else if (sortedStates.length > 2) {
    const regionsArray: RegionDatum[] = [];
    sortedStates.forEach(({regions}) => {
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
        (region) => sortedStates.every(({regions}) => regions.includes(region)));
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
          return getFluentString('peak-list-text-across-the-us');
        }
      }
    }
  }
  // Else list all the regions
  return null;
};

interface Props {
  peakList: CardPeakListDatum;
  active: boolean | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  completedAscents: CompletedMountain[];
  profileView: boolean;
  mountains: Array<{id: Mountain['id']}>;
  numCompletedAscents: number;
  totalRequiredAscents: number;
  isMe: boolean;
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, shortName, parent, type},
    active, listAction, actionText, completedAscents,
    profileView, mountains, numCompletedAscents,
    totalRequiredAscents, isMe,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_STATES_AND_REGIONS, {
    variables: {id: parent ? parent.id : id} });

  if (error) {
    console.error(error);
  }

  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    if (listAction !== null) {
      listAction(id);
    }
  };
  const actionButton = (active === false || profileView === true) && listAction !== null
    ? (
      <ActionButtonContainer>
        <ButtonPrimary onClick={actionButtonOnClick}>
          {actionText}
        </ButtonPrimary>
      </ActionButtonContainer> ) : null;

  const Title = (active === false || profileView === true) && listAction !== null
    ? TitleBase : TitleFull;

  let listInfoContent: React.ReactElement<any>;
  if (active === true) {
    const latestDate = getLatestAscent(mountains, completedAscents, type);

    let latestDateText: React.ReactElement<any>;
    if (latestDate !== undefined) {
      const latestAscentText = getFluentString('peak-list-text-latest-ascent', {
        'completed': (numCompletedAscents === totalRequiredAscents).toString(),
        'has-full-date': (!(isNaN(latestDate.day) || isNaN(latestDate.month))).toString(),
      });
      latestDateText = (
        <>
          {latestAscentText} <BigText>{formatDate(latestDate)}</BigText>
        </>
      );
    } else {
      latestDateText = <>{getFluentString('peak-list-text-no-completed-ascent')}</>;
    }
    listInfoContent = (
      <>
        <span>
          <BigText>{numCompletedAscents}/{totalRequiredAscents}</BigText>
          {getFluentString('peak-list-text-completed-ascent')}
        </span>
        <TextRight>{latestDateText}</TextRight>
      </>
    );
  } else {

    let statesArray: StateDatum[] = [];
    if (loading === false && data !== undefined && data.peakList) {
      if (data.peakList.parent && data.peakList.parent.states && data.peakList.parent.states.length) {
        statesArray = [...data.peakList.parent.states];
      } else if (data.peakList.states && data.peakList.states.length) {
        statesArray = [...data.peakList.states];
      }
    }
    listInfoContent = (
      <>
        <span>
          <BigText>{totalRequiredAscents}</BigText>
          {getFluentString('peak-list-text-total-ascents')}
        </span>
        <TextRight>{getStatesOrRegion(statesArray, getFluentString)}</TextRight>
      </>
    );
  }
  const mountainLogoId = parent === null ? id : parent.id;

  const renderProp = (user: User | null) => {
    let desktopURL: string;
    if (profileView === true) {
      if (isMe === true) {
        const userId = user !== null ? user._id : 'none';
        desktopURL = comparePeakListLink(userId, id);
      } else {
        desktopURL = listDetailWithMountainDetailLink(id, 'none');
      }
    } else {
      desktopURL = searchListDetailLink(id);
    }
    return (
      <LinkWrapper mobileURL={listDetailWithMountainDetailLink(id, 'none')} desktopURL={desktopURL}>
        <Root>
          <Title>
            {name}{getType(type)}
          </Title>
          <ListInfo>
            {listInfoContent}
          </ListInfo>
          <LogoContainer>
            <MountainLogo
              id={mountainLogoId}
              title={name}
              shortName={shortName}
              variant={type}
              active={active}
              completed={numCompletedAscents === totalRequiredAscents}
            />
          </LogoContainer>
          {actionButton}
          <ProgressBarContainer>
            <PeakProgressBar
              variant={active === true ? type : null}
              completed={active === true && numCompletedAscents ? numCompletedAscents : 0}
              total={totalRequiredAscents}
              id={id}
            />
          </ProgressBarContainer>
        </Root>
      </LinkWrapper>
    );
  };
  return (
    <UserContext.Consumer
      children={renderProp}
    />
  );
};

export default PeakListCard;
