import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import { Routes } from '../../routing/routes';
import {
  searchListDetailLink,
  searchMountainsDetailLink,
} from '../../routing/Utils';
import { ContentFull } from '../../styling/Grid';
import {
  ButtonBase,
  linkColor,
} from '../../styling/styleUtils';
import { getBrowser } from '../../Utils';
import SignUpModal from '../sharedComponents/SignUpModal';

const {browser} = getBrowser();
const videoStyles = browser === 'Edge'
  ? 'min-width: 100%; min-height: 100%;'
  : 'width: 100%; height: 100%;';

const Root = styled(ContentFull)`
  position: relative;
  overflow: auto;
  height: 100%;
`;

const PlaceholderBackground = styled.div`
  object-fit: cover;
  ${videoStyles}
  position: fixed;
  z-index: -2;
  background-image: url("${require('../../assets/video/landing-video-placeholder.jpg').default}");
  background-size: cover;
  background-repeat: no-repeat;
`;
const VideoBackground = styled.video`
  object-fit: cover;
  ${videoStyles}
  position: fixed;
  z-index: -1;
`;

const ContentRoot = styled.div`
  height: 100%;
  z-index: 100;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavContainer = styled.div`
  color: #fff;
  text-transform: uppercase;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
`;

const NavButton = styled(Link)`
  color: #fff;
  text-decoration: none;
  border: 1px solid #fff;
  border-radius: 4px;
  width: 200px;
  padding: 0.6rem;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.75rem;
  letter-spacing: 1px;

  &:hover {
    color: ${linkColor};
    background-color: #fff;
  }
`;

const SignUpButton = styled(ButtonBase)`
  color: ${linkColor};
  background-color: #fff;
  letter-spacing: 1px;
  width: 200px;
  padding: 0.6rem;
  font-size: 1rem;
`;

const TitleContainer = styled.h1`
  color: #fff;
  font-family: DeliciousRomanWeb;
  font-size: 2.6rem;
  text-align: center;
  margin-bottom: 0;
`;

const TextContainer = styled.p`
  text-align: center;
  color: #fff;
  font-family: DeliciousRomanWeb;
  font-size: 1.1rem;
`;

const TextList = styled.ul`
  text-align: center;
  color: #fff;
  font-family: DeliciousRomanWeb;
  font-size: 1.1rem;
  list-style: none;
  margin-bottom: 2rem;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TrailSign = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 4rem;
  margin: 1rem 0 0;
`;

const DisclaimerLinks = styled.div`
  margin-top: auto;
  padding-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 100;
`;

const WhiteLink = styled(Link)`
  color: #fff;
  margin: 0 0.4rem;
  font-size: 0.75rem;

  &:hover {
    color: #fff;
  }
`;

const CopyrightText = styled.div`
  color: #fff;
  margin: 0 0.4rem;
  font-size: 0.75rem;
`;

const LoginPage = () => {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);

  const getString = useFluent();
  const openSignUpModal = useCallback(() => setSignUpModalOpen(true), []);
  const closeSignUpModal = useCallback(() => setSignUpModalOpen(false), []);

  const signUpModal = isSignUpModalOpen === false ? null : (
    <SignUpModal
      text={getString('global-text-value-modal-sign-up-today', {
        'list-short-name': 'Wilderlist',
      })}
      onCancel={closeSignUpModal}
    />
  );

  return (
    <Root>
      <ContentRoot>
        <TitleContainer>
          {getString('login-page-plan-your-trip-title')}
        </TitleContainer>
        <TextContainer>
          {getString('login-page-plan-your-trip-desc')}
        </TextContainer>
        <NavContainer>
          <NavButton to={searchListDetailLink('search')}>
            {getString('global-text-value-search-hiking-lists')}
          </NavButton>
          <NavButton to={searchMountainsDetailLink('search')}>
            {getString('global-text-value-search-mountains')}
          </NavButton>
        </NavContainer>
        <TrailSign icon='map-signs' />
        <TitleContainer>
          {getString('login-page-track-your-adventure-title')}
        </TitleContainer>
        <TextList>
          <ListItem>{getString('login-page-track-your-adventure-li-1')}</ListItem>
          <ListItem>{getString('login-page-track-your-adventure-li-2')}</ListItem>
          <ListItem>{getString('login-page-track-your-adventure-li-3')}</ListItem>
          <ListItem>{getString('login-page-track-your-adventure-li-4')}</ListItem>
          <ListItem>{getString('login-page-track-your-adventure-li-5')}</ListItem>
        </TextList>
        <SignUpButton onClick={openSignUpModal}>
          {getString('login-page-sign-up-for-free')}
        </SignUpButton>
      </ContentRoot>
      <DisclaimerLinks>
        <CopyrightText>
          Copyright © Wilderlist {new Date().getFullYear()}
        </CopyrightText>
        <WhiteLink to={Routes.TermsOfUse}>
          {getString('header-text-menu-terms-of-use')}
        </WhiteLink>
        <WhiteLink to={Routes.PrivacyPolicy}>
          {getString('header-text-menu-privacy-policy')}
        </WhiteLink>
      </DisclaimerLinks>
      <PlaceholderBackground />
      <VideoBackground
        loop={true}
        muted={true}
        autoPlay={true}
      >
        <source src={require('../../assets/video/login-video.mp4').default} />
      </VideoBackground>
      {signUpModal}
    </Root>
  );
};

export default LoginPage;
