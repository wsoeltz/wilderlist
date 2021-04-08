import React from 'react';
import styled, {keyframes} from 'styled-components/macro';
import { PreContentHeaderFull } from '../../../styling/Grid';
import {
  ButtonPrimary,
  CompactButtonPrimaryLink,
  GhostButton,
  lowWarningColorLight,
} from '../../../styling/styleUtils';
import {mobileSize} from '../../../Utils';

const slideDown = keyframes`
  0%   {
    opacity: 0;
    min-height: 0px;
  }
  100% {
    opacity: 1;
    min-height: 50px;
  }
`;

const Root = styled(PreContentHeaderFull)`
  overflow: hidden;
  background-color: ${lowWarningColorLight};
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  animation: ${slideDown} 0.5s ease-in-out forwards;
  z-index: 2000;

  @media (max-width: ${mobileSize}px) {
    position: fixed;
    left: 0;
    right: 0;
    top: 90px;
  }
`;

const buttonSize = '0.7rem';

const ConfirmButton = styled(ButtonPrimary)`
  margin: 0 1rem;
  font-size: ${buttonSize};
`;

const TripReportButton = styled(CompactButtonPrimaryLink)`
  margin-right: 1rem;
  font-size: ${buttonSize};
  white-space: nowrap;
`;

const DismissButton = styled(GhostButton)`
  font-size: ${buttonSize};
`;

interface Props {
  children: React.ReactNode;
  onConfirm: () => void;
  tripReportUrl?: string;
  onDismiss: () => void;
  confirmText: string;
  dismissText: string;
  tripReportText?: string;
}

const Notification = (props: Props) => {
  const {
    children, confirmText, onConfirm, dismissText, onDismiss, tripReportUrl, tripReportText,
  } = props;

  const tripReportButton = tripReportUrl && tripReportText ? (
    <TripReportButton to={tripReportUrl}>
      {tripReportText}
    </TripReportButton>
  ) : null;

  return (
    <Root>
      <div>
        {children}
      </div>
      <ConfirmButton onClick={onConfirm}>
        {confirmText}
      </ConfirmButton>
      {tripReportButton}
      <DismissButton onClick={onDismiss}>
        {dismissText}
      </DismissButton>
    </Root>
  );
};

export default Notification;
