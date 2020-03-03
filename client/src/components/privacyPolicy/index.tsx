import { GetString } from 'fluent-react/compat';
import React, { useContext } from 'react';
import Helmet from 'react-helmet';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentFull,
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
      <ContentFull>
        <ContentBody>
          <h1>{getFluentString('header-text-menu-privacy-policy')}</h1>
          <div dangerouslySetInnerHTML={{__html: getFluentString('privacy-and-usage-policy-content')}} />
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default PrivacyPolicy;
