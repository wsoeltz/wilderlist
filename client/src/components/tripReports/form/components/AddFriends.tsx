import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  useGetFriendsBasic,
} from '../../../../queries/users/useGetFriendsBasic';
import {
  BasicIconInText,
  ButtonPrimary,
  DetailBoxTitle,
  DetailBoxWithMargin,
  SemiBold,
} from '../../../../styling/styleUtils';
import {
  ButtonWrapper,
  ListItem,
} from '../Utils';
import FriendSelector from './FriendSelector';

interface Props {
  userId: string;
  emailList: string[];
  setEmailList: (emails: string[]) => void;
  userList: string[];
  setUserList: (users: string[]) => void;
}

const AddFriends = (props: Props) => {
  const {
    emailList, setEmailList, userList, setUserList,
    userId,
  } = props;

  const getString = useFluent();
  const {loading, error, data} = useGetFriendsBasic(userId);

  const [isFriendSelectorModalOpen, setFriendSelectorModalOpen] = useState<boolean>(false);
  const openFriendSelector = useCallback(() => setFriendSelectorModalOpen(true), []);

  const closeAndAddFriends = (friends: string[], emails: string[]) => {
    setUserList([...friends]);
    setEmailList([...emails]);
    setFriendSelectorModalOpen(false);
  };

  let friendsList: React.ReactElement<any> | null;
  if (loading === true) {
    friendsList = null;
  } else if (error !== undefined) {
    console.error(error);
    friendsList =  null;
  } else if (data !== undefined) {
    const { user } = data;
    if (!user) {
      friendsList = null;
    } else {
      const friends = user.friends ? user.friends : [];

      const friendSelectorModal = isFriendSelectorModalOpen ? (
        <FriendSelector
          closeAndAddFriends={closeAndAddFriends}
          friends={friends}
          initialUserList={userList}
          initialEmails={emailList}
        />
      ) : null;
      const friendElements = friends.length === 0 ? null : friends.map(f => {
        if (f.user && f.user.name && userList.indexOf(f.user.id) !== -1) {
          return (
            <ListItem key={f.user.id}><SemiBold>{f.user.name}</SemiBold></ListItem>
          );
        } else {
          return null;
        }
      });
      friendsList = (
        <>
          {friendElements}
          {friendSelectorModal}
        </>
      );
    }
  } else {
    friendsList = null;
  }

  const emailListItems = emailList.map((email, i) => (
    <ListItem key={email + i}>
      <SemiBold>{email}</SemiBold>
    </ListItem>
  ));

  const friendAndEmailList = emailList.length || userList.length ? (
    <div>
      {friendsList}
      {emailListItems}
    </div>
  ) : <>{friendsList}</>;
  const addBtnText = emailList.length || userList.length
    ? getString('mountain-completion-modal-add-remove-people')
    : getString('mountain-completion-modal-add-people');

  return (
    <>
      <DetailBoxTitle>
        <BasicIconInText icon={faUserFriends} />
        {getString('mountain-completion-modal-text-people-hiked-with')}
      </DetailBoxTitle>
      <DetailBoxWithMargin>
      {friendAndEmailList}
        <ButtonWrapper>
          <ButtonPrimary onClick={openFriendSelector}>
            {addBtnText}
          </ButtonPrimary>
        </ButtonWrapper>
      </DetailBoxWithMargin>
    </>
  );

};

export default AddFriends;
