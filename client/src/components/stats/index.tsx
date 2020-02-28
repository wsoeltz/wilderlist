import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import Helmet from 'react-helmet';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';
import { mobileSize } from '../../Utils';
import { AppContext } from '../App';
import AllMountains from '../stats/AllMountains';
import Stats from './Stats';
import {
  SectionTitleH3,
} from '../../styling/styleUtils';

interface Props {
  userId: string;
}

const YourStats = (props: Props) => {
  const { userId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const { windowWidth } = useContext(AppContext);

  let content: React.ReactElement<any> | null;
  if (windowWidth < mobileSize) {
    content = (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <SectionTitleH3>
              {getFluentString('your-stats-title')}
            </SectionTitleH3>
            <Stats
              userId={userId}
            />
            <AllMountains
              userId={userId}
            />
          </ContentBody>
        </ContentLeftLarge>
      </>
    );
  }  else {
    content = (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <SectionTitleH3>
              {getFluentString('your-stats-title')}
            </SectionTitleH3>
            <Stats
              userId={userId}
            />
          </ContentBody>
        </ContentLeftLarge>
        <ContentRightSmall>
          <ContentBody>
            <AllMountains
              userId={userId}
            />
          </ContentBody>
        </ContentRightSmall>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getFluentString('meta-data-your-stats-default-title')}</title>
      </Helmet>
      {content}
    </>
  );
};

export default YourStats;
