import React from 'react';
import styled from 'styled-components';
import {
  boldFontWeight,
  ButtonPrimary,
  ButtonSecondary,
  Label,
} from '../../styling/styleUtils';
import { UserDatum } from './index';

const Root = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 150px;
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

const ProfilePictureContainer = styled.div`
  grid-row: 2;
  grid-column: 1;
  padding-right: 2rem;
`;

const ProfilePicture = styled.img`
  max-width: 160px;
  border-radius: 4000px;
`;

const BoldLink = styled.a`
  font-weight: ${boldFontWeight};
`;

interface Props {
  user: UserDatum;
}

const Header = (props: Props) => {
  const {
    user: { name, email, profilePictureUrl },
  } = props;

  return (
    <Root>
      <TitleContent>
        <Title>{name}</Title>
        <ListInfo>
          <Label>Email:</Label> <BoldLink href={`mailto:${email}`}>{email}</BoldLink>
        </ListInfo>
      </TitleContent>
      <ProfilePictureContainer>
        <ProfilePicture alt={name} title={name} src={profilePictureUrl}/>
      </ProfilePictureContainer>
      <BeginRemoveListButtonContainer>
        <ButtonSecondary>Remove Friend</ButtonSecondary>
        <ButtonPrimary>Compare All Summits</ButtonPrimary>
      </BeginRemoveListButtonContainer>
    </Root>
  );
};

export default Header;
