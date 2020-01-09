import {
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { searchListDetailLink, searchMountainsDetailLink } from '../../routing/Utils';
import {
  lightBaseColor,
  linkColor,
  semiBoldFontBoldWeight,
} from '../../styling/styleUtils';
import { getBrowser } from '../../Utils';

const {browser} = getBrowser();
const mobileWidth = 890;
const videoStyles = browser === 'Edge'
  ? 'min-width: 100%; min-height: 100%;'
  : 'width: 100%; height: 100%;';

const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const VideoBackground = styled.video`
  object-fit: cover;
  ${videoStyles}
  position: relative;
`;

const ContentRoot = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 100;
  display: grid;
  padding: 2rem;

  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto auto 75px 1fr;
  grid-template-areas: "t"
                       "logo"
                       "google-btn"
                       "nav"
                       "text";
  grid-row-gap: 2rem;

  @media (min-width: ${mobileWidth}px) {
    padding-right: 6rem;
    grid-template-columns: 1fr 800px;
    grid-template-rows: 1fr auto auto 75px 1fr;
    grid-template-areas: "t t"
                         "l logo"
                         "l google-btn"
                         "l nav"
                         "l text";
  }
`;

const LogoContainer = styled.div`
  grid-area: logo;

  svg {
    fill: #fff;
  }
`;

export const googleBlue = '#4285f4';
export const redditRed = '#ff4500';

export const LoginButtonBase = styled.a`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin: auto 20px;
  max-height: 40px;
  min-width: 168px;
  max-width: 200px;
  text-decoration: none;
  border: 1px solid #efefef;
  color: ${lightBaseColor};
  font-weight: ${semiBoldFontBoldWeight};

  &:hover {
    color: ${lightBaseColor};
    background-color: #efefef;
  }
`;

export const BrandIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  margin-left: 8px;
`;

export const LoginText = styled.span`
  font-size: 14px;
  padding: 8px;
`;

const SplashScreenLoginButton = styled(LoginButtonBase)`
  padding: 4px 6px;
  margin-bottom: 1rem;
`;

const LoginButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  grid-area: google-btn;
  margin: auto;

  @media (min-width: ${mobileWidth}px) {
    transform: translateY(-60%);
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 0;
    max-height: 66px;
  }
`;

const NavContainer = styled.div`
  grid-area: nav;
  color: #fff;
  font-family: DeliciousRomanWeb;
  font-size: 1.6rem;
  text-transform: uppercase;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  text-align: center;
`;

const NavButton = styled(Link)`
  color: #fff;
  text-decoration: none;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${linkColor};
    background-color: #fff;
  }
`;

const TextContainer = styled.div`
  grid-area: text;
  color: #fff;
  font-family: DeliciousRomanWeb;
  font-size: 1.6rem;
  text-align: center;

  @media (min-width: ${mobileWidth}px) {
    font-size: 2.15rem;
    margin-left: auto;
    text-align: left;
  }
`;

const LoginPage = () => {

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  return (
    <Root>
      <ContentRoot>
        <LogoContainer
          dangerouslySetInnerHTML={{
            __html: raw('../../assets/logo/logo.svg'),
          }}
          title={getFluentString('global-text-value-wilderlist-name')}
        />
        <LoginButtonsContainer>
          <SplashScreenLoginButton href='/auth/google'>
            <BrandIcon
              icon={faGoogle}
              style={{color: googleBlue}}
            />
            <LoginText>
              {getFluentString('header-text-login-with-google')}
            </LoginText>
          </SplashScreenLoginButton>
          <SplashScreenLoginButton href='/auth/reddit'>
            <BrandIcon
              icon={faReddit}
              style={{color: redditRed}}
            />
            <LoginText>
              {getFluentString('header-text-login-with-reddit')}
            </LoginText>
          </SplashScreenLoginButton>
        </LoginButtonsContainer>

        <NavContainer>
          <NavButton to={searchListDetailLink('search')}>Search Lists</NavButton>
          <NavButton to={searchMountainsDetailLink('search')}>Search Mountains</NavButton>
        </NavContainer>
        <TextContainer>
          {getFluentString('login-page-tagline-text')}
        </TextContainer>
      </ContentRoot>
      <VideoBackground
        loop={true}
        muted={true}
        autoPlay={true}
      >
        <source src={require('../../assets/video/login-video.mp4')} />
      </VideoBackground>
    </Root>
  );
};

export default LoginPage;
