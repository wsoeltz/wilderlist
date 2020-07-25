import { faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { BasicIconInText } from '../../../styling/styleUtils';
import {isTouchDevice} from '../../../Utils';

const Root = styled.div`
  margin-left: auto;
  font-size: 0.7rem;
  opacity: 0.8;
`;

export default () => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const text = isTouchDevice() && window.innerWidth < 1024
    ? getFluentString('map-scroll-zoom-text-mobile')
    : getFluentString('map-scroll-zoom-text');
  return (
    <Root>
      <BasicIconInText icon={faSearchPlus} />
      {text}
    </Root>
  );
};
