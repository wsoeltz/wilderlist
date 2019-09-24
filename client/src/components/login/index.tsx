import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import {lightBaseColor} from '../../styling/styleUtils';

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
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr 500px;
  grid-template-rows: 1fr 300px 200px 100px;
  grid-row-gap: 2rem;
`;

const LoginWithGoogleButton = styled.a`
  background-color: #fff;
  border-radius: 4px;
  height: 40px;
  max-width: 190px;
  display: flex;
  align-items: center;
  margin-left: auto;
  grid-column: 2;
  grid-row: 3;

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
    }
  }
`;

const LoginPage = () => {

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const text = getFluentString('header-text-login-with-google');
  console.log(text);

  return (
    <Root>
      <ContentRoot>
        <LoginWithGoogleButton href='/auth/google'
          dangerouslySetInnerHTML={{
            __html: raw('../../assets/images/google-signin-button/btn_google_light_normal_ios.svg')
            }}
        />
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