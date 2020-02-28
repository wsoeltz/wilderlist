import { GetString } from 'fluent-react';
import React, { useContext } from 'react';
import Helmet from 'react-helmet';
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

  const metaDescription = getFluentString('meta-data-privacy-policy-description');

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-privacy-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getFluentString('meta-data-privacy-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
      </Helmet>
      <ContentLeftLarge>
        <ContentBody>
          <h1>{getFluentString('header-text-menu-privacy-policy')}</h1>
          <div dangerouslySetInnerHTML={{__html: getFluentString('privacy-and-usage-policy-content')}} />
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default PrivacyPolicy;
