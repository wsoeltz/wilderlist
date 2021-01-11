import { faAt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  FriendsDatum,
} from '../../../../queries/users/useGetFriendsBasic';
import {
  BasicIconInText,
  ButtonPrimary,
  ButtonSecondary,
  CheckboxListCheckbox,
  CheckboxListItem,
  DetailBox,
  DetailBoxTitle,
  GhostButton,
} from '../../../../styling/styleUtils';
import {
  FriendStatus,
} from '../../../../types/graphQLTypes';
import Modal from '../../../sharedComponents/Modal';
import {
  CheckboxList,
  Input,
  ModalButtonWrapper,
  NoDateText,
} from '../Utils';

const Root = styled.div`
  display: grid;
  grid-template-columns: 220px 300px;
  grid-gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
  }
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

  const getString = useFluent();

  const [userList, setUserList] = useState<string[]>(initialUserList);
  const [emails, setEmails] = useState<string[]>(
    initialEmails.length ? initialEmails : ['']);

  const incrementEmailList = useCallback(() => setEmails(curr => [...curr, '']), []);

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
            {getString('mountain-completion-modal-text-no-friends-yet')}
          </small>
        </NoDateText>
      );
    }
  } else {
    friendsList = (
      <NoDateText>
        <small>
          {getString('mountain-completion-modal-text-no-friends-yet')}
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

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.which === 13) {
      setEmails(['', ...emails]);
    }
  };

  const emailInputs = emails.map((email, i) => (
    <EmailRow key={i}>
      <Input
        value={email}
        onChange={handleEmailChange(i)}
        placeholder={'email@example.com'}
        autoComplete={'off'}
        onKeyPress={onEnterPress}
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
    <ModalButtonWrapper>
      <ButtonPrimary onClick={onClose} mobileExtend={true}>
        Done adding friends
      </ButtonPrimary>
    </ModalButtonWrapper>
  );

  return (
    <Modal
      onClose={onClose}
      actions={actions}
      width={'600px'}
      height={'400px'}
    >
      <Root>
        <div>
          <DetailBoxTitle>
            <BasicIconInText icon={faUserFriends} />
            {getString('mountain-completion-modal-text-add-wilderlist-friends')}
          </DetailBoxTitle>
          <DetailBox>
            {friendsList}
          </DetailBox>
        </div>
        <div>
          <DetailBoxTitle>
            <BasicIconInText icon={faAt} />
            {getString('mountain-completion-modal-text-add-other-friends')}
          </DetailBoxTitle>
          <DetailBox>
            {emailInputs}
            <ButtonSecondary onClick={incrementEmailList}>
              {getString('mountain-completion-modal-text-add-email-button')}
            </ButtonSecondary>
          </DetailBox>
        </div>
      </Root>
    </Modal>
  );
};

export default FriendSelector;
