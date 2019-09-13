import { sortBy } from 'lodash';
import React, {useContext} from 'react';
import styled from 'styled-components';
import { listDetailLink, preventNavigation, searchListDetailLink } from '../../../routing/Utils';
import {
  boldFontWeight,
  ButtonPrimary,
  Card,
} from '../../../styling/styleUtils';
import {
  CompletedMountain,
  Mountain,
  PeakListVariants,
  Region,
  State,
} from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import DynamicLink from '../../sharedComponents/DynamicLink';
import MountainLogo from '../mountainLogo';
import { completedPeaks, formatDate, getLatestAscent } from '../Utils';
import { PeakListDatum } from './ListPeakLists';
import PeakProgressBar from './PeakProgressBar';
import { GetString } from 'fluent-react';
import {
  AppLocalizationAndBundleContext
} from '../../../contextProviders/getFluentLocalizationContext';

const LinkWrapper = styled(DynamicLink)`
  display: block;
  color: inherit;
  text-decoration: inherit;
  grid-row: span 3;
  grid-column: span 2;

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

  @media(max-width: ${smallCardBreakpoint}px) {

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
  margin-right: 0.1rem;
  font-weight: ${boldFontWeight};
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

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

  const Title = active === false || isCurrentUser === false
    ? TitleBase : TitleFull;

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

  let listInfoContent: React.ReactElement<any>;
  if (active === true) {
    const latestDate = getLatestAscent(mountains, completedAscents, type);

    let latestDateText: React.ReactElement<any>;
    if (latestDate !== undefined) {
      const latestAscentText = getFluentString('peak-list-text-latest-ascent', {
        'completed': (numCompletedAscents === totalRequiredAscents).toString(),
        'has-full-date': !(isNaN(latestDate.day) || isNaN(latestDate.month)).toString(),
      })
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
    listInfoContent = (
      <>
        <span>
          <BigText>{totalRequiredAscents}</BigText>
          {getFluentString('peak-list-text-total-ascents')}
        </span>
        <TextRight>{getStatesOrRegion(mountains)}</TextRight>
      </>
    );
  }
  const mountainLogoId = parent === null ? id : parent.id;
  const desktopURL = isCurrentUser === true ? searchListDetailLink(id) : listDetailLink(id);
  return (
    <LinkWrapper mobileURL={listDetailLink(id)} desktopURL={desktopURL}>
      <Root>
        <Title>
          {name}
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

export default PeakListCard;
