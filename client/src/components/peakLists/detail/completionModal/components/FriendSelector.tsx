import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  ButtonSecondary,
  CheckboxList,
  CheckboxListCheckbox,
  CheckboxListItem,
  GhostButton,
} from '../../../../../styling/styleUtils';
import {
  FriendStatus,
} from '../../../../../types/graphQLTypes';
import {ButtonWrapper} from '../../../../sharedComponents/AreYouSureModal';
import Modal from '../../../../sharedComponents/Modal';
import {
  FriendsDatum,
} from '../queries';
import {
  Input,
  NoDateText,
} from '../Utils';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const EmailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

interface Props {
  closeAndAddFriends: (friends: string[], emails: string[]) => void;
  friends: FriendsDatum['user']['friends'];
  initialUserList: string[];
  initialEmails: string[];
}

const FriendSelector = (props: Props) => {
  const {
    closeAndAddFriends, friends, initialUserList, initialEmails,
  } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [userList, setUserList] = useState<string[]>(initialUserList);
  const [emails, setEmails] = useState<string[]>(
    initialEmails.length ? initialEmails : ['']);

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

  const handleEmailChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmails(
        emails.map((email, _index) => {
          if (email === e.target.value || index !== _index) {
            return email;
          } else {
            return e.target.value;
          }
        },
      ),
    );

  const deleteEmail = (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEmails(emails.filter((_v, i) => i !== index));
  };

  const emailInputs = emails.map((email, i) => (
    <EmailRow key={i}>
      <Input
        value={email}
        onChange={handleEmailChange(i)}
        placeholder={'name@example.com'}
        autoComplete={'off'}
      />
      <GhostButton onClick={deleteEmail(i)}>
        ×
      </GhostButton>
    </EmailRow>
  ));

  const onClose = () => {
    closeAndAddFriends(userList, emails.filter(v => v.length));
  };

  const actions = (
    <ButtonWrapper>
      <ButtonPrimary onClick={onClose}>
        Done adding friends
      </ButtonPrimary>
    </ButtonWrapper>
  );

  return (
    <Modal
      onClose={onClose}
      actions={actions}
      width={'400px'}
      height={'400px'}
    >
      <Root>
        <div>
          {friendsList}
        </div>
        <div>
          {emailInputs}
          <ButtonSecondary onClick={() => setEmails([...emails, ''])}>
            Add another email address
          </ButtonSecondary>
        </div>
      </Root>
    </Modal>
  );
};

export default FriendSelector;
