import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  CheckboxList,
  CheckboxListCheckbox,
  CheckboxListItem,
  RemoveIcon,
} from '../../../../../styling/styleUtils';
import {
  FriendStatus,
} from '../../../../../types/graphQLTypes';
import LoadingSpinner from '../../../../sharedComponents/LoadingSpinner';
import {
  FriendsDatum,
  GET_FRIENDS,
} from '../queries';
import {
  Input,
  NoDateText,
  SectionTitle,
} from '../Utils';

const AddEmailButton = styled(ButtonPrimary)`
  width: 100%;
`;

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

  const [emailInput, setEmailInput] = useState<string>('');

  const updateEmailList = () => {
    if (!emailList.includes(emailInput)) {
      setEmailList([...emailList, emailInput]);
      setEmailInput('');
    }
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.which === 13) {
      updateEmailList();
    }
  };

  const removeEmailFromList = (email: string) => {
    const newEmailList = emailList.filter(e => e !== email);
    setEmailList([...newEmailList]);
  };

  const toggleUserList = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newUserList = [...userList, e.target.value];
      setUserList([...newUserList]);
    } else {
      const newUserList = userList.filter(usedId => usedId !== e.target.value);
      setUserList([...newUserList]);
    }
  };

  let friendsList: React.ReactElement<any> | null;
  if (loading === true) {
    friendsList = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    friendsList =  (
      <NoDateText>
        <small>
          {getFluentString('global-error-retrieving-data')}
        </small>
      </NoDateText>
    );
  } else if (data !== undefined) {
    const { user } = data;
    if (!user) {
      friendsList = (
        <NoDateText>
          <small>
            {getFluentString('global-error-retrieving-data')}
          </small>
        </NoDateText>
      );
    } else {
      const { friends } = user;
      if (friends && friends.length) {
        const friendElements: Array<React.ReactElement<any>> = [];
        friends.forEach(f => {
          if (f.status === FriendStatus.friends && f.user) {
            friendElements.push(
              <CheckboxListItem htmlFor={f.user.id} key={f.user.id}>
                <CheckboxListCheckbox
                  id={f.user.id} type='checkbox'
                  value={f.user.id}
                  checked={userList.indexOf(f.user.id) !== -1}
                  onChange={toggleUserList}
                />
                {f.user.name}
              </CheckboxListItem>,
            );
          }
        });
        if (friendElements.length) {
          friendsList = (
            <CheckboxList>
              {friendElements}
            </CheckboxList>
          );
        } else {
          friendsList = (
            <NoDateText>
              <small>
                {getFluentString('mountain-completion-modal-text-no-friends-yet')}
              </small>
            </NoDateText>
          );
        }
      } else {
        friendsList = (
          <NoDateText>
            <small>
              {getFluentString('mountain-completion-modal-text-no-friends-yet')}
            </small>
          </NoDateText>
        );
      }
    }
  } else {
    friendsList = null;
  }

  const emailListItems = emailList.map((email, i) => (
    <CheckboxListItem
      key={email + i}
      onClick={() => removeEmailFromList(email)}
    >
      {email}
      <RemoveIcon>×</RemoveIcon>
    </CheckboxListItem>
  ));
  const emailListElement = emailListItems.length ? (
    <CheckboxList>
      {emailListItems}
    </CheckboxList>
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
        <Input
          placeholder={getFluentString('global-text-value-modal-email-address')}
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          onKeyPress={onEnterPress}
          maxLength={1000}
          autoComplete={'off'}
        />
        <AddEmailButton
          disabled={emailInput === ''}
          onClick={updateEmailList}
        >
          {getFluentString('mountain-completion-modal-text-add-email-button')}
        </AddEmailButton>
        {emailListElement}
      </div>
    </>
  );

};

export default AddFriends;
