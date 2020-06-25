import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  listDetailWithMountainDetailLink,
  preventNavigation,
  searchListDetailLink,
} from '../../../routing/Utils';
import {
  ButtonPrimary,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
  StackableCardFooter,
  StackableCardSection as CardBase,
  StackedCardWrapper,
} from '../../../styling/styleUtils';
import { getColorSetFromVariant } from '../../../styling/styleUtils';
import {
  roundPercentToSingleDecimal,
} from '../../../Utils';
import { getType } from '../Utils';
import { CompactPeakListDatum } from './ListPeakLists';
import VariantLinks from './VariantLinks';

const Root = styled.div`
  border-left-width: 8px;
  border-left-style: solid;
  margin-bottom: 2rem;
`;

const LinkWrapper = styled(StackedCardWrapper)`
  margin-bottom: 0;
`;

const Card = styled(CardBase)`
  border-left-width: 0;
`;

const CardFooter = styled(StackableCardFooter)`
  border-left-width: 0;
`;

const SubtleText = styled.small`
  text-transform: uppercase;
  font-size: 0.85rem;
  opacity: 0.7;
`;

interface Props {
  peakList: CompactPeakListDatum;
  active: boolean | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  totalRequiredAscents: number;
  numCompletedAscents: number;
  queryRefetchArray: Array<{query: any, variables: any}>;
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, type, stateOrRegionString}, peakList,
    active, listAction, actionText, totalRequiredAscents,
    numCompletedAscents, queryRefetchArray,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [hovered, setHovered] = useState<boolean>(false);

  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    if (listAction !== null) {
      listAction(id);
    }
  };

  let cornerContent: React.ReactElement<any> | null;
  if (active === true) {
    const percent = roundPercentToSingleDecimal(numCompletedAscents, totalRequiredAscents);
    const percentComplete = isNaN(percent) ? 0 : percent;
    cornerContent = (
      <SubtleText>
        {percentComplete}% {getFluentString('global-text-value-complete')}
      </SubtleText>
    );
  } else if (listAction !== null) {
    cornerContent = (
      <ButtonPrimary onClick={actionButtonOnClick}>
        {actionText}
      </ButtonPrimary>
    );
  } else {
    cornerContent = null;
  }

  return (
    <Root
      style={{borderLeftColor: getColorSetFromVariant(type).tertiary}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <LinkWrapper
        mobileURL={listDetailWithMountainDetailLink(id, 'none')}
        desktopURL={searchListDetailLink(id) + window.location.search}
      >
        <Card>
          <CardTitle>
            {name}{getType(type)}
          </CardTitle>
          <CardSubtitle>
            <CollapsedParagraph>
              {stateOrRegionString}
            </CollapsedParagraph>
            <CollapsedParagraph>
              {cornerContent}
            </CollapsedParagraph>
          </CardSubtitle>
        </Card>
      </LinkWrapper>
      <CardFooter>
        <VariantLinks
          peakList={peakList}
          queryRefetchArray={queryRefetchArray}
          grayText={!hovered}
        />
      </CardFooter>
    </Root>
  );
};

export default PeakListCard;
