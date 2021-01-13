import { faAt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sortBy from 'lodash/sortBy';
import React, {useCallback} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  FriendsDatum,
} from '../../../../queries/users/useGetFriendsBasic';
import {
  BasketTitle,
  ButtonSecondary,
  CheckboxListCheckbox,
  CheckboxListItem,
  GhostButton,
  IconContainer,
  placeholderColor,
} from '../../../../styling/styleUtils';
import {
  FriendStatus,
} from '../../../../types/graphQLTypes';
import {
  CheckboxList,
  Input,
  NoDateText,
} from '../Utils';

const Root = styled.div`
  margin: 1rem 0 2rem;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.75rem;

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
  friends: FriendsDatum['user']['friends'];
  userList: string[];
  emails: string[];
  setUserList: (users: string[]) => void;
  setEmails: (emails: string[]) => void;
}

const FriendSelector = (props: Props) => {
  const {
    friends, userList, emails, setUserList, setEmails,
  } = props;

  const getString = useFluent();

  const incrementEmailList = useCallback(() => setEmails([...emails, '']), [setEmails, emails]);

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
    sortBy(friends, ['user.name']).forEach(f => {
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

  return (
    <Root>
      <div>
        <BasketTitle>
          <IconContainer $color={placeholderColor}>
            <FontAwesomeIcon icon={faUserFriends} />
          </IconContainer>
          {getString('mountain-completion-modal-text-add-wilderlist-friends')}
        </BasketTitle>
        <div>
          {friendsList}
        </div>
      </div>
      <div>
        <BasketTitle>
          <IconContainer $color={placeholderColor}>
            <FontAwesomeIcon icon={faAt} />
          </IconContainer>
          {getString('mountain-completion-modal-text-add-other-friends')}
        </BasketTitle>
        <div>
          {emailInputs}
          <ButtonSecondary onClick={incrementEmailList}>
            {getString('mountain-completion-modal-text-add-email-button')}
          </ButtonSecondary>
        </div>
      </div>
    </Root>
  );
};

export default FriendSelector;
