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
  Card,
  CardLinkWrapper,
  CardSubtitle,
  CardTitle,
} from '../../../styling/styleUtils';
import { getType } from '../Utils';
import { CompactPeakListDatum } from './ListPeakLists';
import {
  GET_STATES_AND_REGIONS,
  getStatesOrRegion,
  SuccessResponse,
  Variables,
} from './PeakListCard';

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
}

const PeakListCard = (props: Props) => {
  const {
    peakList: {id, name, type, parent},
    active, listAction, actionText,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(GET_STATES_AND_REGIONS, {
    variables: {id: parent ? parent.id : id} });

  if (error) {
    console.error(error);
  }

  const mountainList =
    loading === false && data !== undefined && data.peakList && data.peakList.mountains
      ? data.peakList.mountains : [];

  const actionButtonOnClick = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    if (listAction !== null) {
      listAction(id);
    }
  };
  const actionButton = active === false && listAction !== null
    ? (
        <ButtonPrimary onClick={actionButtonOnClick}>
          {actionText}
        </ButtonPrimary>
      ) : (
      <SubtleText>
        List Active
      </SubtleText>
    );

  return (
      <CardLinkWrapper
        mobileURL={listDetailWithMountainDetailLink(id, 'none')}
        desktopURL={searchListDetailLink(id)}
      >
        <Card>
          <CardTitle>
            {name}{getType(type)}
          </CardTitle>
          <CardSubtitle>
            <div>
              {getStatesOrRegion(mountainList, getFluentString)}
            </div>
            <div>
              {actionButton}
            </div>
          </CardSubtitle>
        </Card>
      </CardLinkWrapper>
  );
};

export default PeakListCard;
