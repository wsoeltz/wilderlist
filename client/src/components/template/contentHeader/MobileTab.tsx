import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import {
  lightBaseColor,
  lightBorderColor,
} from '../../../styling/styleUtils';
import {isTouchDevice} from '../../../Utils';

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Tab = styled.div`
  width: 100%;
  height: 1rem;
  background-color: #fff;
  pointer-events: all;
  position: relative;
  bottom: -1px;
  border: solid 1px ${lightBorderColor};
  border-bottom: none;
  display: flex;
  justify-content: center;
`;
const Icon = styled(FontAwesomeIcon)`
  transform: translateY(20%);
  color: ${lightBaseColor};
`;

const MobileTab = () => {
  if (!isTouchDevice()) {
    return null;
  }
  return (
    <Root>
      <Tab>
        <Icon icon={faGripLines} />
      </Tab>
    </Root>
  );
};

export default MobileTab;
