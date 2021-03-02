const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearTrails,
} from '../../../queries/trails/useGeoNearTrails';
import { trailDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { CoreItem } from '../../../types/itemTypes';
import {slopeToSteepnessClass} from '../../../utilities/trailUtils';
import GhostCard from '../../sharedComponents/GhostDetailCard';
import Results from '../../sharedComponents/listComponents/Results';
import {tentNeutralSvg} from '../../sharedComponents/svgIcons';

const TrailSearchPage = () => {
  const getString = useFluent();

  const {loading, error, data, latitude, longitude} = useGeoNearTrails();

  let list: React.ReactElement<any> | null;
  if (loading === true && data === undefined) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostCard key={i} />);
    }
    list = <>{loadingCards}</>;
  } else if (error !== undefined) {
    console.error(error);
    list =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    if (!data.trails) {
      const loadingCards: Array<React.ReactElement<any>> = [];
      for (let i = 0; i < 3; i++) {
        loadingCards.push(<GhostCard key={i} />);
      }
      list = <>{loadingCards}</>;
    } else {
      const mapCenter = point([longitude, latitude]);
      const trails = data.trails.map(t => {
        const formattedType = upperFirst(getString('global-formatted-trail-type', {type: t.type}));
        const name = t.name ? t.name : formattedType;
        return {
          id: t.id,
          title: name,
          location: t.center,
          locationText: t.locationText,
          type: CoreItem.trail,
          url: trailDetailLink(t.id),
          icon: tentNeutralSvg,
          customIcon: true,
          distanceToCenter: distance(mapCenter, point(t.center)),
          formattedType,
          trailLength: t.trailLength,
          slopeText: t.avgSlope !== null
            ? `${upperFirst(slopeToSteepnessClass(t.avgSlope))}, ${parseFloat(t.avgSlope.toFixed(1))}°`
            : null,
        };
      });
      list = (
        <Results
          data={trails as any}
          type={CoreItem.trail}
        />
      );
    }
  } else {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostCard key={i} />);
    }
    list = <>{loadingCards}</>;
  }

  const metaDescription = getString('meta-data-trail-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-trail-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-trail-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + trailDetailLink('search')} />
      </Helmet>
      {list}
    </>
  );
};

export default TrailSearchPage;
