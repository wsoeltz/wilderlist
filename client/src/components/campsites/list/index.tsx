const {point} = require('@turf/helpers');
const distance = require('@turf/distance').default;
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import Helmet from 'react-helmet';
import useFluent from '../../../hooks/useFluent';
import {
  useGeoNearCampsites,
} from '../../../queries/campsites/useGeoNearCampsites';
import { campsiteDetailLink } from '../../../routing/Utils';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { CoreItem } from '../../../types/itemTypes';
import GhostCard from '../../sharedComponents/GhostDetailCard';
import Results from '../../sharedComponents/listComponents/Results';
import {tentNeutralSvg} from '../../sharedComponents/svgIcons';
import CreateCampsiteButton from './CreateCampsiteButton';

const CampsiteSearchPage = () => {
  const getString = useFluent();

  const {loading, error, data, latitude, longitude} = useGeoNearCampsites();

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
    if (!data.campsites) {
      const loadingCards: Array<React.ReactElement<any>> = [];
      for (let i = 0; i < 3; i++) {
        loadingCards.push(<GhostCard key={i} />);
      }
      list = <>{loadingCards}</>;
    } else {
      const mapCenter = point([longitude, latitude]);
      const campsites = data.campsites.map(c => {
        const formattedType = upperFirst(getString('global-formatted-campsite-type', {type: c.type}));
        const name = c.name ? c.name : formattedType;
        return {
          id: c.id,
          title: name,
          location: c.location,
          locationText: c.locationText,
          type: CoreItem.campsite,
          url: campsiteDetailLink(c.id),
          icon: tentNeutralSvg,
          customIcon: true,
          distanceToCenter: distance(mapCenter, point(c.location)),
          formattedType,
          ownership: c.ownership,
        };
      });
      list = (
        <Results
          data={campsites as any}
          type={CoreItem.campsite}
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

  const metaDescription = getString('meta-data-campsite-search-description');

  return (
    <>
      <Helmet>
        <title>{getString('meta-data-campsite-search-default-title')}</title>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta property='og:title' content={getString('meta-data-campsite-search-default-title')} />
        <meta
          property='og:description'
          content={metaDescription}
        />
        <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + campsiteDetailLink('search')} />
      </Helmet>
      {list}
      <CreateCampsiteButton />
    </>
  );
};

export default CampsiteSearchPage;
