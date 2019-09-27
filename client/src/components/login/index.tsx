import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {lightBaseColor, semiBoldFontBoldWeight} from '../../styling/styleUtils';

const mobileWidth = 890;

const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const VideoBackground = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
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
  grid-template-rows: 1fr auto auto 1fr;
  grid-template-areas: "t"
                       "logo"
                       "google-btn"
                       "text";
  grid-row-gap: 2rem;

  @media (min-width: ${mobileWidth}px) {
    padding-right: 6rem;
    grid-template-columns: 1fr 800px;
    grid-template-rows: 1fr auto 200px 100px;
    grid-template-areas: "t t"
                         "l logo"
                         "l google-btn"
                         "l text";
  }
`;

const LogoContainer = styled.div`
  grid-area: logo;

  svg {
    fill: #fff;
  }
`;

const LoginWithGoogleButton = styled.a`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  grid-area: google-btn;
  margin: auto;
  max-height: 50px;
  max-width: 220px;
  text-decoration: none;


  &:hover {
    background-color: #efefef;
  }

  svg {

    rect {
      fill: none;
    }
    text {
      fill: ${lightBaseColor};
      font-size: 14px;
      font-weight: ${semiBoldFontBoldWeight};
    }
  }

  @media (min-width: ${mobileWidth}px) {
    transform: translateY(-60%);
    margin-right: 0;
    margin-top: 0;
    margin-bottom: 0;
    max-height: 66px;
    max-width: 286px;
  }
`;

const TextContainer = styled.div`
  grid-area: text;
  color: #fff;
  font-family: DeliciousRomanWeb;
  font-size: 1.6rem;
  text-align: center;

  @media (min-width: ${mobileWidth}px) {
    font-size: 2.1rem;
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
        <LoginWithGoogleButton href='/auth/google'
          dangerouslySetInnerHTML={{
            __html: raw('../../assets/images/google-signin-button/btn_google_light_normal_ios.svg'),
            }}
            title={getFluentString('header-text-login-with-google')}
        />
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
