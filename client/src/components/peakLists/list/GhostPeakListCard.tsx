import React from 'react';
import styled from 'styled-components';
import { lightBorderColor } from '../../../styling/styleUtils';
import {
  ListInfo,
  LogoContainer,
  ProgressBarContainer,
  Root,
  TextRight,
  TitleFull,
} from './PeakListCard';

const PlaceholderRoot = styled(Root)`
  opacity: 0.7;
`;

const PlaceholderBase = styled.div`
  background-color: ${lightBorderColor};
`;

const PlaceholderTitle = styled(PlaceholderBase)`
  width: 100%;
  height: 1.7rem;
`;

const PlaceholderText = styled(PlaceholderBase)`
  width: 40%;
  height: 1rem;
`;

const PlaceholderTextRight = styled(TextRight)`
  width: 60%;
  display: flex;
  justify-content: flex-end;
`;

const PlaceholderLogo = styled(PlaceholderBase)`
  padding-top: 100%;
  width: 100%;
  border-radius: 4000px;
`;

const PlaceholderProgressBar = styled(ProgressBarContainer)`
  display: flex;
  align-items: flex-end;

  &:after {
    content: '';
    height: 1.2rem;
    width: 100%;
    background-color: ${lightBorderColor};
  }
`;

const GhostPeakListCard = () => {
  return (
    <PlaceholderRoot>
      <TitleFull>
        <PlaceholderTitle />
      </TitleFull>
      <ListInfo>
        <PlaceholderText />
        <PlaceholderTextRight>
          <PlaceholderText />
        </PlaceholderTextRight>
      </ListInfo>
      <LogoContainer>
        <PlaceholderLogo />
      </LogoContainer>
      <PlaceholderProgressBar />
    </PlaceholderRoot>
  );
};

export default GhostPeakListCard;
