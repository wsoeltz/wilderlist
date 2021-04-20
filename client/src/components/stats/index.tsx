import {faChartBar} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Helmet from 'react-helmet';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFluent from '../../hooks/useFluent';
import {
  HighlightedIconInText,
} from '../../styling/styleUtils';
import MapLegend from '../sharedComponents/detailComponents/header/MapLegend';
import PleaseLogin from '../sharedComponents/PleaseLogin';
import Stats from './Stats';

const YourStats = () => {
  const user = useCurrentUser();
  const getString = useFluent();

  if (!user && user !== null) {
    return <PleaseLogin />;
  } else if (user) {
    return (
      <>
        <Helmet>
          <title>{getString('meta-data-your-stats-default-title')}</title>
        </Helmet>
        <MapLegend
          type={'heatmap'}
          hasMountains={true}
          hasTrails={true}
          hasCampsites={true}
        />
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
