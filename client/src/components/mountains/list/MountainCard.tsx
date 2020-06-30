import {
  faArrowRight,
  faCrow,
  faMapMarkerAlt,
  faMountain,
} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { mountainDetailLink, searchMountainsDetailLink } from '../../../routing/Utils';
import {
  BasicIconAtEndOfText,
  BasicIconInText,
  CardFooterButton,
  CardFooterLink,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
  locationColor,
  secondaryColor,
  Seperator,
  StackableCardFooter,
  StackableCardSection,
  StackedCardWrapper,
} from '../../../styling/styleUtils';
import {AppContext} from '../../App';
import Tooltip from '../../sharedComponents/Tooltip';
import { MountainDatum, MountainDatumWithDistance } from './ListMountains';

const Root = styled.div`
  margin-bottom: 2rem;
`;

const LinkWrapper = styled(StackedCardWrapper)`
  margin-bottom: 0;
`;

const Details = styled(CollapsedParagraph)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.8rem;
  margin: 0.4rem 0 0;
`;

const CardFooter = styled(StackableCardFooter)`
  border-left-width: 0;
`;

const OverviewLink = styled(CardFooterLink)`
  width: 50%;
  color: ${secondaryColor};

  &:hover {
    color: #fff;
  }
`;

const MapButton = styled(CardFooterButton)`
  width: 50%;
  color: ${secondaryColor};

  &:hover {
    color: #fff;
  }
`;

interface Props {
  mountain: MountainDatumWithDistance;
  setHighlighted: (highlighted: MountainDatum[]) => void;
}

const MountainCard = ({ mountain, setHighlighted }: Props) => {
  const { name, elevation, state, distanceToUser } = mountain;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {usersLocation} = useContext(AppContext);

  const stateName = state !== null ? (
    <>
      <Seperator>|</Seperator>
      {state.name}
    </>
  ) : null;

  const crowFliesText = usersLocation && usersLocation.data && distanceToUser
    ? (
        <span>
          <Tooltip
            explanation={getFluentString('mountain-card-crow-flies-tooltip')}
          >
            <BasicIconInText icon={faCrow} />
          </Tooltip>
          {parseFloat(distanceToUser.toFixed(1))} mi from {usersLocation.data.text}
        </span>)
    : null;

  return (
<>
    <Root>
      <LinkWrapper
        mobileURL={mountainDetailLink(mountain.id)}
        desktopURL={searchMountainsDetailLink(mountain.id) + window.location.search}
      >
        <StackableCardSection>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>
            <Details>
              <span>
                <BasicIconInText icon={faMountain} />
                {elevation}ft
                {stateName}
              </span>
              {crowFliesText}
            </Details>
          </CardSubtitle>
        </StackableCardSection>
      </LinkWrapper>
      <CardFooter>
        <OverviewLink
          mobileURL={mountainDetailLink(mountain.id)}
          desktopURL={searchMountainsDetailLink(mountain.id) + window.location.search}
          color={secondaryColor}
          $isActive={false}
        >
          {getFluentString('mountain-card-view-details')}
          <BasicIconAtEndOfText icon={faArrowRight} />
        </OverviewLink>
        <MapButton
          color={locationColor}
          $isActive={false}
          onClick={() => setHighlighted([mountain])}
        >
          {getFluentString('mountain-card-show-on-map')}
          <BasicIconAtEndOfText icon={faMapMarkerAlt} />
        </MapButton>
      </CardFooter>
    </Root>

  </>
  );
};

export default MountainCard;
