import React, {useState} from 'react';
import styled from 'styled-components/macro';
import LogoPng from '../../assets/logo/logo.png';
import useFluent from '../../hooks/useFluent';
import {Routes} from '../../routing/routes';
import {
  ButtonSecondaryLink,
  GhostButton,
} from '../../styling/styleUtils';

const Root = styled.div`
  position: relative;
  padding: 1rem;
`;

const Popup = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 1rem;
  pointer-events: all;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  border-radius: 8px;
`;

const CloseX = styled(GhostButton)`
  padding: 0.875rem 0.75rem;
  line-height: 0;
  font-size: 1.1rem;
  position: absolute;
  top: 0;
  right: 0;
`;

const AboutButton = styled(ButtonSecondaryLink)`
  display: flex;
  padding: 0.5rem 2rem;
  align-items: center;
  line-height: 1.1;
`;

const CloseButton = styled(GhostButton)`
  display: block;
  padding: 0.5rem 2rem;
  text-align: right;
  margin-right: -1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Header = styled.h1`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.span`
  font-size: 0;
  color: rgba(0, 0, 0, 0);
  position: absolute;
  opacity: 0;
`;

const Logo = styled.img`
  width: 180px;
  margin-left: 1rem;

  @media (max-width: 400px) {
    width: 120px;
  }
`;

const ContentParagraph = styled.p`
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const popupVersion = '0.2';
const localstorageKey = 'landingPageFirstVisitPopupLocalstorageKey';

const Landing = () => {
  const [showPopup, setShowPopup] = useState<boolean>(localStorage.getItem(localstorageKey) !== popupVersion);
  const getString = useFluent();
  if (!showPopup) {
    return null;
  }

  const closeModal = () => {
    setShowPopup(false);
    localStorage.setItem(localstorageKey, popupVersion);
  };
  return (
    <Root>
      <Popup>
        <CloseX onClick={closeModal}>
          ×
        </CloseX>
        <Header>
          {getString('landing-popup-welcome')} <TitleText>Wilderlist</TitleText>
          <Logo src={LogoPng} alt='Wilderlist' title='Wilderlist' />
        </Header>
        {/* eslint-disable-next-line */}
        <ContentParagraph>{'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}</ContentParagraph>
        <ButtonContainer>
          <AboutButton to={Routes.About}>
            {getString('landing-popup-learn-more')}
          </AboutButton>
          <CloseButton onClick={closeModal}>
            {getString('global-text-value-modal-close')}
          </CloseButton>
        </ButtonContainer>
      </Popup>
    </Root>
  );
};

export default Landing;
