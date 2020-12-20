import { GetString } from 'fluent-react/compat';
import { useContext } from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../contextProviders/getFluentLocalizationContext';

const useFluent = () => {
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);
  return getFluentString;
};

export default useFluent;
