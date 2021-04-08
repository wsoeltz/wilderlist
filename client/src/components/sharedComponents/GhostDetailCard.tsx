import React from 'react';
import styled from 'styled-components/macro';
import {
  lightBorderColor,
} from '../../styling/styleUtils';

const GhostCard = styled.div`
  height: 80px;
  margin: 0 -1rem;
  border-top: solid 1px ${lightBorderColor};
  padding: 1rem;
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
  return (
    <GhostCard>
      <GhostTitle style={{maxWidth: '80%'}} />
      <GhostSubtitle style={{maxWidth: '65%'}} />
    </GhostCard>
  );
};

export default GhostMountainCard;
