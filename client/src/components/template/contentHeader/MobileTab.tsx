import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {Routes} from '../../../routing/routes';
import {
  GhostButton,
  lightBaseColor,
  lightBorderColor,
  tertiaryColor,
} from '../../../styling/styleUtils';
import {isTouchDevice} from '../../../Utils';
import BackButton from './backButton';

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Tab = styled.div`
  width: 100%;
  height: auto;
  background-color: ${tertiaryColor};
  pointer-events: all;
  position: relative;
  bottom: -1px;
  border: solid 1px ${lightBorderColor};
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  transform: translateY(0%);
  color: ${lightBaseColor};
`;

const CloseButton = styled(GhostButton)`
  padding: 0.75rem 0.5rem;
  line-height: 0;
  font-size: 1.2rem;
`;

interface Props {
  hideTab?: boolean;
}

const MobileTab = ({hideTab}: Props) => {
  const { push } = useHistory();

  const tab = hideTab || !isTouchDevice() ? null : <Icon icon={faGripLines} />;

  return (
    <Root>
      <Tab>
        <BackButton
          mobileButton={true}
          key={'mobile-back-button'}
        />
        {tab}
        <CloseButton
          onClick={() => push(Routes.Landing)}
        >
          ×
        </CloseButton>
      </Tab>
    </Root>
  );
};

export default MobileTab;
