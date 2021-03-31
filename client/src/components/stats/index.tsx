import {faChartBar} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Helmet from 'react-helmet';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFluent from '../../hooks/useFluent';
import {
  HighlightedIconInText,
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
        <h1>
          <HighlightedIconInText icon={faChartBar} /> &nbsp;{getString('your-stats-title')}
        </h1>
        <br />
        <Stats
        />
      </>
    );
  } else {
    return null;
  }
};

export default YourStats;
