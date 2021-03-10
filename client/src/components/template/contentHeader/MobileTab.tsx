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
import {isTouchDevice, mobileSize} from '../../../Utils';
import BackButton from './backButton';

const RootBase = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  @media (min-width: ${mobileSize + 1}px) {
    display: none;
  }
`;

const InlineRoot = styled(RootBase)`
  margin: -1rem -1rem 0.5rem;
  width: auto;
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
  font-size: 1.75rem;
`;

interface Props {
  hideTab?: boolean;
}

const MobileTab = ({hideTab}: Props) => {
  const { push } = useHistory();

  const tab = hideTab || !isTouchDevice() ? null : <Icon icon={faGripLines} />;

  const Root = hideTab ? InlineRoot : RootBase;

  return (
    <Root>
      <Tab style={{backgroundColor: hideTab ? '#fff' : undefined}}>
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
