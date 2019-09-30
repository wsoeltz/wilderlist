import { GetString } from 'fluent-react';
import React, { useContext } from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../styling/Grid';

const PrivacyPolicy = () => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  return (
    <ContentLeftLarge>
      <ContentBody>
        <h1>{getFluentString('header-text-menu-privacy-policy')}</h1>
        <div dangerouslySetInnerHTML={{__html: getFluentString('privacy-and-usage-policy-content')}} />
      </ContentBody>
    </ContentLeftLarge>
  );
};

export default PrivacyPolicy;
