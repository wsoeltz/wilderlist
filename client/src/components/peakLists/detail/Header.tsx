import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { CompletedMountain, PeakListVariants } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive} from '../../../Utils';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
} from '../list';
import { getStatesOrRegion } from '../list/PeakListCard';
import MountainLogo from '../mountainLogo';
import { completedPeaks } from '../Utils';
import {
  MountainDatum,
  PeakListDatum,
  UserDatum,
} from './index';

const Root = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 150px;
  grid-template-rows: auto auto auto;
`;

const TitleContent = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BeginRemoveListButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: right;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const ListInfo = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const LogoContainer = styled.div`
  grid-row: 2;
  grid-column: 1;
`;

const REMOVE_PEAK_LIST_FROM_USER = gql`
  mutation removePeakListFromUser($userId: ID!, $peakListId: ID!) {
    removePeakListFromUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
      }
    }
  }
`;

interface Props {
  mountains: MountainDatum[];
  peakList: PeakListDatum;
  user: UserDatum;
  completedAscents: CompletedMountain[];
  comparisonUser?: UserDatum;
  comparisonAscents?: CompletedMountain[];
}

const Header = (props: Props) => {
  const {
    mountains, user, peakList: { name, id, shortName, type }, peakList,
    completedAscents,
  } = props;

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER);
  const [removePeakListFromUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(REMOVE_PEAK_LIST_FROM_USER);

  const usersLists = user.peakLists.map((list) => list.id);
  const active = usersLists.includes(peakList.id);
  const beginRemoveButton = active === false ? (
    <ButtonPrimary onClick={() => addPeakListToUser({variables: {userId: user.id,  peakListId: id}})}>
      Begin List
    </ButtonPrimary>
   ) : (
    <ButtonSecondary onClick={() => removePeakListFromUser({variables: {userId: user.id,  peakListId: id}})}>
      Remove List
    </ButtonSecondary>
   ) ;

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
  let peakCount: React.ReactElement<any>;
  if (props.comparisonAscents === undefined || props.comparisonUser === undefined) {
    peakCount = active === false
    ? <>{`${totalRequiredAscents} Total Ascents`}</>
    : <>{`${numCompletedAscents}/${totalRequiredAscents} Completed Ascents`}</>;
  } else {
    const numComparisonAscents = completedPeaks(mountains, props.comparisonAscents, type);
    peakCount = (
      <>
        <div>{`${user.name}: ${numCompletedAscents}/${totalRequiredAscents} Completed Ascents`}</div>
        <div>{`${props.comparisonUser.name}: ${numComparisonAscents}/${totalRequiredAscents} Completed Ascents`}</div>
      </>
    );
  }

  return (
    <Root>
      <TitleContent>
        <Title>{name}</Title>
        <ListInfo>
          {getStatesOrRegion(mountains)}
        </ListInfo>
        <ListInfo>
          {peakCount}
        </ListInfo>
      </TitleContent>
      <LogoContainer>
        <MountainLogo
          id={id}
          title={name}
          shortName={shortName}
          variant={type}
          active={active}
        />
      </LogoContainer>
      <BeginRemoveListButtonContainer>
        {beginRemoveButton}
      </BeginRemoveListButtonContainer>
    </Root>
  );
};

export default Header;
