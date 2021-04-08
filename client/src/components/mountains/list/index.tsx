const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearMountains,
} from '../../../queries/mountains/useGeoNearMountains';
import { mountainDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { CoreItem } from '../../../types/itemTypes';
import GhostDetailCard from '../../sharedComponents/GhostDetailCard';
import Results from '../../sharedComponents/listComponents/Results';
import {mountainNeutralSvg} from '../../sharedComponents/svgIcons';
import CreateMountainButton from './CreateMountainButton';

const MountainSearchPage = () => {
  const getString = useFluent();

  const {loading, error, data, latitude, longitude} = useGeoNearMountains();

  let list: React.ReactElement<any> | null;
  if (loading === true && data === undefined) {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostDetailCard key={i} />);
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
    if (!data.mountains) {
      const loadingCards: Array<React.ReactElement<any>> = [];
      for (let i = 0; i < 3; i++) {
        loadingCards.push(<GhostDetailCard key={i} />);
      }
      list = <>{loadingCards}</>;
    } else {
      const mapCenter = point([longitude, latitude]);
      const mountains = data.mountains.map(m => {
        return {
          id: m.id,
          title: m.name,
          location: m.location,
          locationText: m.locationText,
          elevation: m.elevation,
          type: CoreItem.mountain,
          url: mountainDetailLink(m.id),
          icon: mountainNeutralSvg,
          customIcon: true,
          distanceToCenter: distance(mapCenter, point(m.location)),
        };
      });
      list = (
        <Results
          data={mountains as any}
          type={CoreItem.mountain}
        />
      );
    }
  } else {
    const loadingCards: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < 3; i++) {
      loadingCards.push(<GhostDetailCard key={i} />);
    }
    list = <>{loadingCards}</>;
  }

  const metaDescription = getString('meta-data-mountain-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-mtn-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-mtn-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + mountainDetailLink('search')} />
      </Helmet>
      {list}
      <CreateMountainButton />
    </>
  );
};

export default MountainSearchPage;
