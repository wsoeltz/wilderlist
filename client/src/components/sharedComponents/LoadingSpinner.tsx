import { GetString } from 'fluent-react/compat';
import React, {useContext, useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  lightBaseColor,
  lightBorderColor,
} from '../../styling/styleUtils';

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// Compass aniamtion from https://codepen.io/wavyknife/pen/JdEGQR

const needleMove = keyframes`
  0%   {transform:rotate(0deg);}
  10%  {transform:rotate(12deg);}
  40%  {transform:rotate(-25deg);}
  60%  {transform:rotate(20deg);}
  80%  {transform:rotate(-15deg);}
  100% {transform:rotate(0deg);}
`;

const Compass = styled.div`
  border: 2px solid ${lightBorderColor};
  display: block;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  margin: 0 auto 1rem auto;
  transform: scale(1.3);
`;

const Needle = styled.div`
  width: 6px;
  margin: 12px auto 0 auto;
  animation-name: ${needleMove};
  animation-duration: 2500ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;

  &:after {
    content: '';
    display: block;
    border-color: ${lightBaseColor} transparent;
    border-style: solid;
    border-width: 0px 3px 10px 3px;
    margin-top: -15px;
  }

  &:before {
    content: '';
    display: block;
    border-color: ${lightBorderColor} transparent;
    border-style: solid;
    border-width: 10px 3px 0px 3px;
    margin-bottom: -20px;
  }
`;

const Text = styled.div`
  color: ${lightBaseColor};
  font-style: italic;
`;

interface Props {
  hideText?: boolean;
  message?: {
    basic?: string;
    medium?: string;
    long?: string;
    extraLong?: string;
  };
}

const LoadingSpinner = (props: Props) => {
  const {message, hideText} = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const initialMessage = message && message.basic !== undefined
    ? message.basic : getFluentString('global-text-value-loading');

  const [loadingMessage, setLoadingMessage] = useState<string>(initialMessage);

  useEffect(() => {
    const mediumTimer = setTimeout(() => {
      const newMessage = message && message.medium !== undefined
        ? message.medium : getFluentString('global-text-value-loading-medium');
      setLoadingMessage(newMessage);
    }, 2500);
    const longTimer = setTimeout(() => {
      const newMessage = message && message.long !== undefined
        ? message.long : getFluentString('global-text-value-loading-long');
      setLoadingMessage(newMessage);
    }, 8000);
    const extraLongTimer = setTimeout(() => {
      const newMessage = message && message.extraLong !== undefined
        ? message.extraLong : getFluentString('global-text-value-loading-extra-long');
      setLoadingMessage(newMessage);
    }, 15000);
    return () => {
      clearTimeout(mediumTimer);
      clearTimeout(longTimer);
      clearTimeout(extraLongTimer);
    };
  });

  const text = hideText ? null : <Text>{loadingMessage}...</Text>;

  return (
    <Root>
      <Compass>
        <Needle />
      </Compass>
      {text}
    </Root>
  );
};

export default LoadingSpinner;
