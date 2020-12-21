import React from 'react';
import Helmet from 'react-helmet';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFluent from '../../hooks/useFluent';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../styling/Grid';
import {
  SectionTitleH3,
} from '../../styling/styleUtils';
import Stats from './Stats';

const YourStats = () => {
  const user = useCurrentUser();
  const getString = useFluent();

  if (user) {
    return (
      <>
        <Helmet>
          <title>{getString('meta-data-your-stats-default-title')}</title>
        </Helmet>
        <ContentLeftLarge>
          <ContentBody>
            <SectionTitleH3>
              {getString('your-stats-title')}
            </SectionTitleH3>
            <Stats
              userId={user._id}
            />
          </ContentBody>
        </ContentLeftLarge>
      </>
    );
  } else {
    return null;
  }
};

export default YourStats;
