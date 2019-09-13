import React from 'react';
import styled from 'styled-components';
import { lightBorderColor } from '../../../styling/styleUtils';
import {
  Root,
  Title,
  TextContainer,
} from './UserCard';

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


const GhostPeakListCard = () => {
  return (
    <PlaceholderRoot>
      <TextContainer>
        <PlaceholderTitle />
        <PlaceholderText style={{width: '68%'}} />
        <PlaceholderText style={{width: '40%'}} />
      </TextContainer>
      <ProfilePicture />
    </PlaceholderRoot>
  );
};

export default GhostPeakListCard;
