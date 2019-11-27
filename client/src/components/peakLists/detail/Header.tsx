import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  GhostButton,
} from '../../../styling/styleUtils';
import { CompletedMountain, PeakListVariants } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive} from '../../../Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import SignUpModal from '../../sharedComponents/SignUpModal';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
} from '../list';
import {
  BigText,
  getStatesOrRegion,
  TextRight,
} from '../list/PeakListCard';
import PeakProgressBar from '../list/PeakProgressBar';
import MountainLogo from '../mountainLogo';
import { completedPeaks, formatDate, getLatestAscent, getType } from '../Utils';
import {
  MountainDatum,
  PeakListDatum,
  StateDatum,
  UserDatum,
} from './PeakListDetail';

const Root = styled.div`
  display: grid;
  grid-template-columns: 12.5rem 1fr auto;
  grid-template-rows: auto auto auto auto auto;
  grid-column-gap: 1rem;
`;

const TitleContent = styled.div`
  grid-column: 2 / 4;
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

const ActiveListContentContainer = styled(ListInfo)`
  display: flex;
  justify-content: space-between;
  grid-column: 1 / 4;
  grid-row: 4;
`;

const ProgressBarContainer = styled.div`
  grid-column: 1 / 4;
  grid-row: 5;
`;

export const REMOVE_PEAK_LIST_FROM_USER = gql`
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
  statesArray: StateDatum[];
  peakList: PeakListDatum;
  user: UserDatum | null;
  completedAscents: CompletedMountain[];
  comparisonUser?: UserDatum;
  comparisonAscents?: CompletedMountain[];
}

const Header = (props: Props) => {
  const {
    mountains, user, peakList: { name, id, shortName, type, parent }, peakList,
    completedAscents, comparisonUser, comparisonAscents, statesArray,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(ADD_PEAK_LIST_TO_USER);
  const [removePeakListFromUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(REMOVE_PEAK_LIST_FROM_USER);

  const [isRemoveListModalOpen, setIsRemoveListModalOpen] = useState<boolean>(false);
  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);

  const openSignUpModal = () => {
    setIsSignUpModal(true);
  };
  const closeSignUpModal = () => {
    setIsSignUpModal(false);
  };
  const closeAreYouSureModal = () => {
    setIsRemoveListModalOpen(false);
  };

  const confirmRemove = () => {
    if (user && user.id) {
      removePeakListFromUser({variables: {userId: user.id,  peakListId: id}});
    }
    closeAreYouSureModal();
  };

  const signUpModal = isSignUpModal === false ? null : (
    <SignUpModal
      text={getFluentString('global-text-value-modal-sign-up-today', {
        'list-short-name': shortName,
      })}
      onCancel={closeSignUpModal}
    />
  );

  const areYouSureModal = isRemoveListModalOpen === false ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={getFluentString('global-text-value-are-you-sure-modal')}
      text={getFluentString('peak-list-detail-text-modal-remove-confirm', {
        'peak-list-name': name + getType(type),
      })}
      confirmText={getFluentString('global-text-value-modal-confirm')}
      cancelText={getFluentString('global-text-value-modal-cancel')}
    />
  );

  const usersLists = user ? user.peakLists.map((list) => list.id) : [];
  const active = user ? usersLists.includes(peakList.id) : null;

  const beginList = () => {
    if (user) {
      addPeakListToUser({variables: {userId: user.id,  peakListId: id}});
    } else {
      openSignUpModal();
    }
  };

  const beginRemoveButton = active === false || !user ? (
    <ButtonPrimary onClick={beginList}>
      {getFluentString('peak-list-detail-text-begin-list')}
    </ButtonPrimary>
   ) : (
    <GhostButton onClick={() => setIsRemoveListModalOpen(true)}>
      {getFluentString('peak-list-detail-text-remove-list')}
    </GhostButton>
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

  let listInfoContent: React.ReactElement<any> | null;
  if (user && comparisonUser !== undefined && comparisonAscents !== undefined) {

    const numFriendsCompletedAscents = completedPeaks(mountains, comparisonAscents, type);

    listInfoContent = (
      <ActiveListContentContainer>
        <div>
          <BigText>{numFriendsCompletedAscents}/{totalRequiredAscents}</BigText>
          {getFluentString('user-profile-compare-completed-by', {
            'user-name': comparisonUser.name,
          })}
        </div>
        <TextRight>
          <BigText>{numCompletedAscents}/{totalRequiredAscents}</BigText>
          {getFluentString('user-profile-compare-completed-by', {
            'user-name': user.name,
          })}
        </TextRight>
      </ActiveListContentContainer>
    );
  } else if (active === true) {
    const latestDate = getLatestAscent(mountains, completedAscents, type);

    let latestDateText: React.ReactElement<any>;
    if (latestDate !== undefined) {
      const latestAscentText = getFluentString('peak-list-text-latest-ascent', {
        'completed': (numCompletedAscents === totalRequiredAscents).toString(),
        'has-full-date': ( !(isNaN(latestDate.day) || isNaN(latestDate.month)) // incomplete date is false
          || (isNaN(latestDate.day) && isNaN(latestDate.month) && isNaN(latestDate.year)) // NO date is true
          ).toString(),
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
        <ActiveListContentContainer>
          <div>
            <BigText>{numCompletedAscents}/{totalRequiredAscents}</BigText>
            {getFluentString('peak-list-text-total-ascents')}
          </div>
          <TextRight>{latestDateText}</TextRight>
        </ActiveListContentContainer>
        <ProgressBarContainer>
          <PeakProgressBar
            variant={active === true ? type : null}
            completed={active === true && numCompletedAscents ? numCompletedAscents : 0}
            total={totalRequiredAscents}
            id={id}
          />
        </ProgressBarContainer>
      </>
    );

  } else {
    listInfoContent = null;
  }

  const mountainLogoId = parent === null ? id : parent.id;
  return (
    <Root>
      <TitleContent>
        <Title>{name}{getType(type)}</Title>
        <ListInfo>
          {getStatesOrRegion(statesArray, getFluentString)}
        </ListInfo>
        <ListInfo>
          {totalRequiredAscents} {getFluentString('peak-list-text-total-ascents')}
        </ListInfo>
      </TitleContent>
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
      <BeginRemoveListButtonContainer>
        {beginRemoveButton}
      </BeginRemoveListButtonContainer>
      {listInfoContent}
      {areYouSureModal}
      {signUpModal}
    </Root>
  );
};

export default Header;
