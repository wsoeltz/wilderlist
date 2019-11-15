import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import styled from 'styled-components';
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
} from '../../../styling/styleUtils';
import { getColorSetFromVariant } from '../../../styling/styleUtils';
import {
  CompletedMountain,
  Mountain,
  PeakListVariants,
 } from '../../../types/graphQLTypes';
import {
  failIfValidOrNonExhaustive,
  roundPercentToSingleDecimal,
} from '../../../Utils';
import { getType } from '../Utils';
import { completedPeaks } from '../Utils';
import { CompactPeakListDatum } from './ListPeakLists';
import {
  GET_STATES_AND_REGIONS,
  getStatesOrRegion,
  StateDatum,
  SuccessResponse,
  Variables,
} from './PeakListCard';

const Card = styled(CardBase)`
  border-left-width: 8px;
`;

const SubtleText = styled.div`
  text-transform: uppercase;
  font-size: 0.85rem;
  opacity: 0.7;
`;

interface Props {
  peakList: CompactPeakListDatum;
  active: boolean | null;
  listAction: ((peakListId: string) => void) | null;
  actionText: string;
  completedAscents: CompletedMountain[];
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, shortName, type, parent},
    active, listAction, actionText, completedAscents,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    if (listAction !== null) {
      listAction(id);
    }
  };

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_STATES_AND_REGIONS, {
    variables: {id: parent ? parent.id : id} });

  if (error) {
    console.error(error);
  }

  let statesArray: StateDatum[] = [];
  let cornerContent: React.ReactElement<any> | null;
  if (loading === false && data !== undefined && data.peakList) {
    const { peakList } = data;
    if (peakList.parent && peakList.parent.states && peakList.parent.states.length) {
      statesArray = [...peakList.parent.states];
    } else if (peakList.states && peakList.states.length) {
      statesArray = [...peakList.states];
    }

    if (active === true) {
      let mountains: Array<{id: Mountain['id']}>;
      if (peakList.parent !== null && peakList.parent.mountains !== null) {
        mountains = peakList.parent.mountains;
      } else if (peakList.mountains !== null) {
        mountains = peakList.mountains;
      } else {
        mountains = [];
      }

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

      const percentComplete = roundPercentToSingleDecimal(numCompletedAscents, totalRequiredAscents);

      cornerContent = (
        <SubtleText>
          {percentComplete}% {getFluentString('global-text-value-complete')}
        </SubtleText>
      );
    } else {
      cornerContent = (
        <ButtonPrimary onClick={actionButtonOnClick}>
          {actionText}
        </ButtonPrimary>
      );
    }
  } else {
    cornerContent = null;
  }

  return (
      <CardLinkWrapper
        mobileURL={listDetailWithMountainDetailLink(id, 'none')}
        desktopURL={searchListDetailLink(id)}
      >
        <Card style={{borderLeftColor: getColorSetFromVariant(type).tertiary}}>
          <CardTitle>
            {shortName} - {name}{getType(type)}
          </CardTitle>
          <CardSubtitle>
            <div>
              {getStatesOrRegion(statesArray, getFluentString)}
            </div>
            <div>
              {cornerContent}
            </div>
          </CardSubtitle>
        </Card>
      </CardLinkWrapper>
  );
};

export default PeakListCard;
