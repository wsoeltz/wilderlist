import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { CardPeakListDatum } from '../../../queries/lists/getUsersPeakLists';
import {
  listDetailLink,
  otherUserPeakListLink,
  preventNavigation,
} from '../../../routing/Utils';
import {
  Card,
  CompactButtonPrimary,
} from '../../../styling/styleUtils';
import { getType } from '../../../utilities/dateUtils';
import {mediumSize, mobileSize} from '../../../Utils';
import MountainLogo from '../mountainLogo';
import PeakProgressBar from './PeakProgressBar';

const LinkWrapper = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
  }
`;

const smallCardBreakpoint = 600; // in px

export const Root = styled(Card)`
  display: grid;
  grid-template-columns: 11.875rem 1fr;
  grid-column-gap: 1rem;
  grid-template-rows: auto auto;
  position: relative;

  @media(max-width: ${mediumSize}px) and (min-width: ${mobileSize}px) {
    grid-template-columns: 6.875rem 1fr;
  }

  @media(max-width: ${smallCardBreakpoint}px) {
    grid-template-columns: 8rem 1fr;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  grid-column: 2;
  grid-row: 1;
`;

const ProgressBarRow = styled.div`
  grid-row: 2;
  grid-column: 2;

  @media(max-width: ${smallCardBreakpoint}px) {
    grid-column: 1 / -1;
  }
`;

const TitleBase = styled.h1`
  margin: 2rem 0 0.5rem;
  font-size: 1.25rem;
`;

export const TitleFull = styled.h1`
  margin: 2rem 0 0.5rem;
  font-size: 1.25rem;
`;

const ActionButtonContainer = styled.div`
  text-align: right;
  position: absolute;
  top: 0;
  right: 0;
`;

export const ListInfo = styled.h3`
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 400;
  text-transform: capitalize;

  @media(max-width: ${smallCardBreakpoint}px) {
    flex-direction: column-reverse;
  }
`;

export const LogoContainer = styled.div`
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
  align-items: center;

  @media(max-width: ${smallCardBreakpoint}px) {
    grid-row: 1;
  }
`;

export const ProgressBarContainer = styled.div`
  height: 3.125rem;
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

interface Props {
  peakList: CardPeakListDatum;
  active: boolean | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  numCompletedAscents: number;
  totalRequiredAscents: number;
  latestDate: string | null;
  profileId?: string;
  setActionDisabled?: (peakListId: string) => boolean;
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, shortName, type, parent, stateOrRegionString},
    active, listAction, actionText, numCompletedAscents,
    totalRequiredAscents, profileId,
    latestDate, setActionDisabled,
  } = props;

  const getString = useFluent();

  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    if (listAction !== null) {
      listAction(id);
    }
  };

  const isDisabled = () => {
    if (setActionDisabled) {
      return setActionDisabled(id);
    }
    return false;
  };

  const actionButton = (active === false || profileId !== undefined) && listAction !== null
    ? (
      <ActionButtonContainer>
        <CompactButtonPrimary onClick={actionButtonOnClick} disabled={isDisabled()}>
          {actionText}
        </CompactButtonPrimary>
      </ActionButtonContainer> ) : null;

  const Title = (active === false || profileId !== undefined) && listAction !== null
    ? TitleBase : TitleFull;

  let listInfoContent: React.ReactElement<any>;
  if (active === true) {

    let latestDateText: React.ReactElement<any>;
    if (latestDate !== null) {
      const latestAscentText = getString('peak-list-text-latest-ascent', {
        'completed': (numCompletedAscents === totalRequiredAscents).toString(),
        'has-full-date': 'true',
      });
      latestDateText = (
        <>
          {latestAscentText} {latestDate}
        </>
      );
    } else {
      latestDateText = <>{getString('peak-list-text-no-completed-ascent')}</>;
    }
    listInfoContent = (
      <>
        <span>
          {numCompletedAscents}/{totalRequiredAscents}
          {' '}
          {getString('peak-list-text-completed-ascent')}
        </span>
        <TextRight>{latestDateText}</TextRight>
      </>
    );
  } else {
    listInfoContent = (
      <>
        <span>
          {totalRequiredAscents}
          {' '}
          {getString('peak-list-text-total-ascents')}
        </span>
      </>
    );
  }
  const mountainLogoId = parent === null ? id : parent.id;

  const url = profileId !== undefined
    ? otherUserPeakListLink(profileId, id) : listDetailLink(id);
  return (
    <LinkWrapper to={url}>
      <Root>
        <LogoContainer>
          <MountainLogo
            id={mountainLogoId}
            title={name}
            shortName={shortName}
            variant={type}
            active={active}
            completed={totalRequiredAscents > 0 && numCompletedAscents === totalRequiredAscents}
          />
        </LogoContainer>
        <Content>
          <Title>
            {name}{getType(type)}
          </Title>
          <ListInfo>
            {stateOrRegionString}
          </ListInfo>
          <ListInfo>
            {listInfoContent}
          </ListInfo>
          {actionButton}
        </Content>
        <ProgressBarRow>
          <ProgressBarContainer>
            <PeakProgressBar
              variant={active === true ? type : null}
              completed={active === true && numCompletedAscents ? numCompletedAscents : 0}
              total={totalRequiredAscents}
              id={id}
            />
          </ProgressBarContainer>
        </ProgressBarRow>
      </Root>
    </LinkWrapper>
  );
};

export default PeakListCard;
