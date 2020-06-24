import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
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
  Card as CardBase,
  CardLinkWrapper,
  CardSubtitle,
  CardTitle,
  CollapsedParagraph,
} from '../../../styling/styleUtils';
import { getColorSetFromVariant } from '../../../styling/styleUtils';
import {
  roundPercentToSingleDecimal,
} from '../../../Utils';
import { getType } from '../Utils';
import { CompactPeakListDatum } from './ListPeakLists';

const Card = styled(CardBase)`
  border-left-width: 8px;
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
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, shortName, type, stateOrRegionString},
    active, listAction, actionText, totalRequiredAscents,
    numCompletedAscents,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

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
      <CardLinkWrapper
        mobileURL={listDetailWithMountainDetailLink(id, 'none')}
        desktopURL={searchListDetailLink(id) + window.location.search}
      >
        <Card style={{borderLeftColor: getColorSetFromVariant(type).tertiary}}>
          <CardTitle>
            {shortName} - {name}{getType(type)}
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
      </CardLinkWrapper>
  );
};

export default PeakListCard;
