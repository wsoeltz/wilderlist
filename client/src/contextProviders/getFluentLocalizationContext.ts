import {
  FluentBundle,
} from 'fluent';
import {
  ReactLocalization,
} from 'fluent-react';
import raw from 'raw.macro';
import {
  createContext,
} from 'react';

const POSSESSIVE = ([word]: [string]): string => {
  const lastCharacter = word[word.length - 1];
  if (lastCharacter === 's') {
    return word + "'";
  } else {
    return word + "'s";
  }
};

const SENTENCE_CASE = ([phrase]: [string]): string => {
  return phrase.charAt(0).toUpperCase() + phrase.substr(1);
};

// Taken from https://stackoverflow.com/a/13627586
const ORDINAL_SUFFIX = ([input]: [number]): string => {
  const j = input % 10, k = input % 100;
  if (j === 1 && k !== 11) {
      return 'st';
  }
  if (j === 2 && k !== 12) {
      return 'nd';
  }
  if (j === 3 && k !== 13) {
      return 'rd';
  }
  return 'th';
};
const ORDINAL_NUMBER = ([input]: [number]): string => {
  return input + ORDINAL_SUFFIX([input]);
};

const getLocalizationInfo = (messages: string) => {
  const bundle = new FluentBundle(['en-US'], {
    functions: {
      POSSESSIVE, SENTENCE_CASE, ORDINAL_SUFFIX, ORDINAL_NUMBER,
    },
  });
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
