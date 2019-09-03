import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Card,
} from '../../styling/styleUtils';
import { UserDatum } from './ListUsers';

const LinkWrapper = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: inherit;
  grid-row: span 3;
  grid-column: span 2;

  &:hover {
    color: inherit;
  }
`;

const Root = styled(Card)`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin-top: 0;
`;
const TextContainer = styled.div`
  grid-column: 2;
`;

const ProfilePicture = styled.img`
  grid-column: 1;
  max-width: 64px;
  margin-right: 1.5rem;
  border-radius: 4000px;
`;

interface Props {
  user: UserDatum;
}

const UserCard = (props: Props) => {
  const { user } = props;
  return (
    <LinkWrapper to={'/'}>
      <Root>
        <ProfilePicture src={user.profilePictureUrl} />
        <TextContainer>
          <Title>
            {user.name}
          </Title>
        </TextContainer>
      </Root>
    </LinkWrapper>
  );
};

export default UserCard;
