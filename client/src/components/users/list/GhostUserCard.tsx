import React from 'react';
import styled from 'styled-components/macro';
import { lightBorderColor } from '../../../styling/styleUtils';
import {
  TextContainer,
  Title,
} from './UserCard';

const Root = styled.div`
  margin: 1rem -1rem;
  display: grid;
  grid-template-columns: 6rem 1fr;
  grid-template-rows: 1fr auto;
  grid-column-gap: 1.1rem;
`;

const PlaceholderRoot = styled(Root)`
  opacity: 0.7;
`;

const PlaceholderBase = styled.div`
  background-color: ${lightBorderColor};
`;

const PlaceholderTitle = styled(Title)`
  width: 100%;
  height: 1.7rem;
  background-color: ${lightBorderColor};
  margin-bottom: 1rem;
`;

const PlaceholderText = styled(PlaceholderBase)`
  height: 1rem;
  margin-bottom: 0.75rem;
`;

const ProfilePicture = styled(PlaceholderBase)`
  padding-top: 100%;
  width: 100%;
  border-radius: 4000px;
`;

const GhostPeakListCard = () => (
  <PlaceholderRoot>
    <TextContainer>
      <PlaceholderTitle />
      <PlaceholderText style={{width: '68%'}} />
      <PlaceholderText style={{width: '40%'}} />
    </TextContainer>
    <ProfilePicture />
  </PlaceholderRoot>
);

export default GhostPeakListCard;
