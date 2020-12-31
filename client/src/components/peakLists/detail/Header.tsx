import { gql, useMutation } from '@apollo/client';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import { refetchUsersLists } from '../../../queries/getUsersPeakLists';
import { editPeakListLink } from '../../../routing/Utils';
import {
  BasicIconInText,
  CardBase,
  CompactButtonPrimary,
  CompactButtonSecondary,
  CompactGhostButton,
  CompactGhostButtonLink,
  lightBorderColor,
  StackableCardFooter,
} from '../../../styling/styleUtils';
import {
  CompletedMountain,
  PeakListVariants,
  PermissionTypes,
} from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive} from '../../../Utils';
import AreYouSureModal from '../../sharedComponents/AreYouSureModal';
import SignUpModal from '../../sharedComponents/SignUpModal';
import {
  ADD_PEAK_LIST_TO_USER,
  AddRemovePeakListSuccessResponse,
  AddRemovePeakListVariables,
} from '../list';
import {
  TextRight,
} from '../list/PeakListCard';
import PeakProgressBar from '../list/PeakProgressBar';
import VariantLinks from '../list/VariantLinks';
import MountainLogo from '../mountainLogo';
import { completedPeaks, formatDate, getLatestAscent, getType } from '../Utils';
import FlagModal from './FlagModal';
import {
  MountainDatum,
  PeakListDatum,
  UserDatum,
} from './PeakListDetail';

const mobileWidth = 500; // in px

const Root = styled(CardBase)`
  display: grid;
  grid-template-columns: minmax(10%, 12.5rem) minmax(12rem, 1fr) auto;
  grid-template-rows: auto auto;
  grid-column-gap: 1rem;
  grid-row-gap: 0rem;
  border-bottom: none;

  @media (max-width: ${mobileWidth}px) {
    grid-template-rows: auto auto auto;
    grid-template-columns: minmax(10%, 10.5rem) minmax(6rem, 1fr);
    grid-column-gap: 0.4rem;
    grid-row-gap: 0;
  }
`;

const Footer = styled(StackableCardFooter)`
  border-bottom: solid 1px ${lightBorderColor};
  border-right: solid 1px ${lightBorderColor};
  height: 2.2rem;
`;

const TitleContent = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${mobileWidth}px) {
    grid-row: 2;
  }
`;

const ListSettings = styled.div`
  grid-column: 3;
  grid-row: 1;

  @media (max-width: ${mobileWidth}px) {
    grid-column: 2;
  }
`;

const BeginRemoveListButtonContainer = styled.div`
  text-align: right;
`;

const EditFlagButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: right;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  margin-top: 0;
  font-size: 1.25rem;
`;

const ListInfo = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 0;
  font-size: 0.9rem;
  font-weight: 400;
`;

const LogoContainer = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;

  @media (max-width: ${mobileWidth}px) {
    grid-row: 2;
  }
`;

const ActiveListContentContainer = styled(ListInfo)`
  display: flex;
  justify-content: space-between;
  grid-column: 1 / -1;
  grid-row: 2;

  @media (max-width: ${mobileWidth}px) {
    grid-row: 3;
  }
`;

const ProgressBarContainer = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;

  @media (max-width: ${mobileWidth}px) {
    grid-row: 3;
  }
`;

export const REMOVE_PEAK_LIST_FROM_USER = gql`
  mutation removePeakListFromUser($userId: ID!, $peakListId: ID!) {
    removePeakListFromUser(userId: $userId, peakListId: $peakListId) {
      id
      peakLists {
        id
        name
        shortName
        type
        parent {
          id
        }
        numMountains
        numCompletedAscents(userId: $userId)
        latestAscent(userId: $userId)
        isActive(userId: $userId)
      }
    }
  }
`;

interface Props {
  mountains: MountainDatum[];
  peakList: PeakListDatum;
  user: UserDatum | null;
  completedAscents: CompletedMountain[];
  isOtherUser?: boolean;
  comparisonUser?: UserDatum;
  comparisonAscents?: CompletedMountain[];
  queryRefetchArray?: Array<{query: any, variables: any}>;
}

const Header = (props: Props) => {
  const {
    mountains, user, peakList: { name, id, shortName, type, parent, stateOrRegionString}, peakList,
    completedAscents, comparisonUser, comparisonAscents, isOtherUser,
  } = props;

  const getString = useFluent();

  const queryRefetchArray = props.queryRefetchArray && props.queryRefetchArray.length ? [
      ...props.queryRefetchArray,
  ] : [];

  if (user) {
    queryRefetchArray.push(refetchUsersLists({userId: user.id}));
  }

  const mutationOptions = queryRefetchArray && queryRefetchArray.length && user ? {
    refetchQueries: () => [...queryRefetchArray],
  } : {};

  const [addPeakListToUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(
      ADD_PEAK_LIST_TO_USER, {...mutationOptions});
  const [removePeakListFromUser] =
    useMutation<AddRemovePeakListSuccessResponse, AddRemovePeakListVariables>(
      REMOVE_PEAK_LIST_FROM_USER, {...mutationOptions});

  const [isRemoveListModalOpen, setIsRemoveListModalOpen] = useState<boolean>(false);
  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);

  const openRemoveListModal = useCallback(() => setIsRemoveListModalOpen(true), []);
  const openFlagModal = useCallback(() => setIsFlagModalOpen(true), []);
  const closeFlagModal = useCallback(() => setIsFlagModalOpen(false), []);

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
      text={getString('global-text-value-modal-sign-up-today', {
        'list-short-name': shortName,
      })}
      onCancel={closeSignUpModal}
    />
  );

  const areYouSureModal = isRemoveListModalOpen === false ? null : (
    <AreYouSureModal
      onConfirm={confirmRemove}
      onCancel={closeAreYouSureModal}
      title={getString('global-text-value-are-you-sure-modal')}
      text={getString('peak-list-detail-text-modal-remove-confirm', {
        'peak-list-name': name + getType(type),
      })}
      confirmText={getString('global-text-value-modal-confirm')}
      cancelText={getString('global-text-value-modal-cancel')}
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
    <CompactButtonPrimary onClick={beginList}>
      {getString('peak-list-detail-text-begin-list')}
    </CompactButtonPrimary>
   ) : (
    <CompactButtonSecondary onClick={openRemoveListModal}>
      {getString('peak-list-detail-text-remove-list')}
    </CompactButtonSecondary>
   ) ;

  let editFlagButton: React.ReactElement<any> | null;
  if (!user) {
    editFlagButton = null;
  } else {
    editFlagButton = (user && peakList.author && user.id === peakList.author.id
          && user.peakListPermissions !== -1)
      || (user && user.permissions === PermissionTypes.admin) ? (
      <CompactGhostButtonLink to={editPeakListLink(peakList.id)}>
        {getString('global-text-value-edit')}
      </CompactGhostButtonLink>
    ) : (
      <CompactGhostButton onClick={openFlagModal}>
        <BasicIconInText icon={faFlag} />
        {getString('global-text-value-flag')}
      </CompactGhostButton>
    );
  }

  const topLevelHeading = isOtherUser === true && user !== null ? null : (
      <>
        <BeginRemoveListButtonContainer>
          {beginRemoveButton}
        </BeginRemoveListButtonContainer>
        <EditFlagButtonContainer>
          {editFlagButton}
        </EditFlagButtonContainer>
      </>
    );

  const flagModal = isFlagModalOpen === false ? null : (
    <FlagModal
      onClose={closeFlagModal}
      peakListId={peakList.id}
      peakListName={peakList.name}
    />
  );

  const numCompletedAscents = completedPeaks(mountains, completedAscents, type);
  let totalRequiredAscents: number;
  if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
    totalRequiredAscents = mountains.length;
  } else if (type === PeakListVariants.fourSeason) {
    totalRequiredAscents = mountains.length * 4;
  } else if (type === PeakListVariants.grid) {
    totalRequiredAscents = mountains.length * 12;
  } else {
    totalRequiredAscents = 0;
    failIfValidOrNonExhaustive(type, 'Invalid value for type ' + type);
  }

  let listCount: React.ReactElement<any>;
  let listInfoContent: React.ReactElement<any> | null;
  if (user && comparisonUser !== undefined && comparisonAscents !== undefined) {

    const numFriendsCompletedAscents = completedPeaks(mountains, comparisonAscents, type);

    listInfoContent = (
      <ActiveListContentContainer>
        <div>
          <strong>{numFriendsCompletedAscents}/{totalRequiredAscents}</strong>
          {' '}
          {getString('user-profile-compare-completed-by', {
            'user-name': comparisonUser.name,
          })}
        </div>
        <TextRight>
          <strong>{numCompletedAscents}/{totalRequiredAscents}</strong>
          {' '}
          {getString('user-profile-compare-completed-by', {
            'user-name': user.name,
          })}
        </TextRight>
      </ActiveListContentContainer>
    );
    listCount = (
      <ListInfo>
        {totalRequiredAscents} {getString('peak-list-text-total-ascents')}
      </ListInfo>
    );
  } else if (active === true) {
    const latestDate = getLatestAscent(mountains, completedAscents, type);

    let latestDateText: React.ReactElement<any>;
    if (latestDate !== undefined) {
      const latestAscentText = getString('peak-list-text-latest-ascent', {
        'completed': (numCompletedAscents === totalRequiredAscents).toString(),
        'has-full-date': ( !(isNaN(latestDate.day) || isNaN(latestDate.month)) // incomplete date is false
          || (isNaN(latestDate.day) && isNaN(latestDate.month) && isNaN(latestDate.year)) // NO date is true
          ).toString(),
      });
      latestDateText = (
        <>
          {latestAscentText} {formatDate(latestDate)}
        </>
      );
    } else {
      latestDateText = <>{getString('peak-list-text-no-completed-ascent')}</>;
    }
    listInfoContent = (
      <>
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

    listCount = (
      <>
        <ListInfo>
          {`${numCompletedAscents}/${totalRequiredAscents}`} {getString('peak-list-text-total-ascents')}
        </ListInfo>
        <ListInfo>
          {latestDateText}
        </ListInfo>
      </>
    );
  } else {
    listInfoContent = null;
    listCount = (
      <ListInfo>
        {totalRequiredAscents} {getString('peak-list-text-total-ascents')}
      </ListInfo>
    );
  }

  const mountainLogoId = parent === null ? id : parent.id;
  return (
    <>
      <Root>
        <TitleContent>
          <Title>{name}{getType(type)}</Title>
          <ListInfo>
            {stateOrRegionString}
          </ListInfo>
          {listCount}
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
        <ListSettings>
          {topLevelHeading}
        </ListSettings>
        {listInfoContent}
      </Root>
      <Footer>
        <VariantLinks
          peakList={peakList}
          queryRefetchArray={queryRefetchArray}
        />
      </Footer>
      {areYouSureModal}
      {signUpModal}
      {flagModal}
    </>
  );
};

export default Header;
