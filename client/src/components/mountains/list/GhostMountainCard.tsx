import React from 'react';
import styled from 'styled-components';
import {
  Card,
  lightBorderColor,
} from '../../../styling/styleUtils';

const GhostCard = styled(Card)`
  height: 80px;
`;

const GhostTitle = styled.div`
  height: 1.6rem;
  background-color: ${lightBorderColor};
  margin-bottom: 1rem;
`;

const GhostSubtitle = styled.div`
  height: 1rem;
  background-color: ${lightBorderColor};
`;

const GhostMountainCard = () => {
  const maxWidthTitle = 300 + Math.floor((Math.random() * 100) + 1);
  const maxWidthSubtitle = 100 + Math.floor((Math.random() * 100) + 1);
  return (
    <GhostCard>
      <GhostTitle style={{maxWidth: maxWidthTitle}} />
      <GhostSubtitle style={{maxWidth: maxWidthSubtitle}} />
    </GhostCard>
  );
};

export default GhostMountainCard;
