import {
  FluentBundle,
} from 'fluent';
import {
  ReactLocalization,
} from 'fluent-react';
import {
  createContext,
} from 'react';
import raw from 'raw.macro';

const getLocalizationInfo = (messages: string) => {
  console.log(messages);
  const bundle = new FluentBundle(['en-US']);
  bundle.addMessages(messages);
  function* generateBundles(_locales: string[]) {
    yield bundle;
  }
  const localization = new ReactLocalization(generateBundles(['en-US']));
  const localizationAndBundle = {localization, bundle};
  const LocalizationAndBundleContext = createContext(localizationAndBundle);
  return {
    localizationAndBundle, LocalizationAndBundleContext,
  };
};

const {
  localizationAndBundle: appLocalizationAndBundle,
  LocalizationAndBundleContext: AppLocalizationAndBundleContext,
} = getLocalizationInfo(raw('./messages.ftl'));

export {
  appLocalizationAndBundle, AppLocalizationAndBundleContext,
};
