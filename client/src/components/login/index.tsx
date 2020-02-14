import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { searchListDetailLink, searchMountainsDetailLink } from '../../routing/Utils';
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

const LoginPage = () => {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const signUpModal = isSignUpModalOpen === false ? null : (
    <SignUpModal
      text={getFluentString('global-text-value-modal-sign-up-today', {
        'list-short-name': 'Wilderlist',
      })}
      onCancel={() => setSignUpModalOpen(false)}
    />
  );

  return (
    <Root>
      <ContentRoot>
        <TitleContainer>
          {getFluentString('login-page-plan-your-trip-title')}
        </TitleContainer>
        <TextContainer>
          {getFluentString('login-page-plan-your-trip-desc')}
        </TextContainer>
        <NavContainer>
          <NavButton to={searchListDetailLink('search')}>
            {getFluentString('global-text-value-search-hiking-lists')}
          </NavButton>
          <NavButton to={searchMountainsDetailLink('search')}>
            {getFluentString('global-text-value-search-mountains')}
          </NavButton>
        </NavContainer>
        <TrailSign icon='map-signs' />
        <TitleContainer>
          {getFluentString('login-page-track-your-adventure-title')}
        </TitleContainer>
        <TextList>
          <ListItem>{getFluentString('login-page-track-your-adventure-li-1')}</ListItem>
          <ListItem>{getFluentString('login-page-track-your-adventure-li-2')}</ListItem>
          <ListItem>{getFluentString('login-page-track-your-adventure-li-3')}</ListItem>
          <ListItem>{getFluentString('login-page-track-your-adventure-li-4')}</ListItem>
          <ListItem>{getFluentString('login-page-track-your-adventure-li-5')}</ListItem>
          <ListItem>{getFluentString('login-page-track-your-adventure-li-6')}</ListItem>
        </TextList>
        <SignUpButton onClick={() => setSignUpModalOpen(true)}>
          {getFluentString('login-page-sign-up-for-free')}
        </SignUpButton>
      </ContentRoot>
      <VideoBackground
        loop={true}
        muted={true}
        autoPlay={true}
      >
        <source src={require('../../assets/video/login-video.mp4')} />
      </VideoBackground>
      {signUpModal}
    </Root>
  );
};

export default LoginPage;
