import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
} from '../../../../../styling/styleUtils';
import {
  FriendsDatum,
  GET_FRIENDS,
} from '../queries';
import {
  SectionTitle,
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

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<FriendsDatum, {userId: string}>(GET_FRIENDS, {
    variables: { userId },
  });

  const [isFriendSelectorModalOpen, setFriendSelectorModalOpen] = useState<boolean>(false);

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
            <div><strong>{f.user.name}</strong></div>
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
    <div key={email + i}>
      <strong>{email}</strong>
    </div>
  ));
  const emailListElement = emailListItems.length ? (
    <div>
      {emailListItems}
    </div>
  ) : null;

  return (
    <>
      <div>
        <SectionTitle>
          {getFluentString('mountain-completion-modal-text-add-wilderlist-friends')}
        </SectionTitle>
        {friendsList}
      </div>
      <div>
        <SectionTitle>
          {getFluentString('mountain-completion-modal-text-add-other-friends')}
        </SectionTitle>
        <small>
          {getFluentString('mountain-completion-modal-text-add-other-friends-note')}
        </small>
        {emailListElement}
        <ButtonPrimary onClick={() => setFriendSelectorModalOpen(true)}>
          Add/Remove Friends
        </ButtonPrimary>
      </div>
    </>
  );

};

export default AddFriends;
