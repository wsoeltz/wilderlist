import React from 'react';
import styled from 'styled-components/macro';
import AllTrailsLogoImageUrl from '../assets/images/alltrails-logo.svg';
import CaltopoLogoImageUrl from '../assets/images/caltopo-logo.png';
import GoogleMapsLogoImageUrl from '../assets/images/google-maps-logo.png';

const TextContainer = styled.span`
  display: inline-block;
  margin-right: 0.6rem;
  text-decoration: underline;
  font-weight: 600;
`;

const ExternalLink = styled.a`
  line-height: 1;
`;

const GoogleMapsLogo = styled.img`
  max-width: 90px;
`;
const CaltopoLogo = styled.img`
  max-width: 80px;
  position: relative;
  top: 2px;
`;

export const GoogleMapsLink = ({lat, long}: {lat: number, long: number}) => {
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
  return (
    <ExternalLink href={googleUrl} target='_blank' rel='noopener' title='Google Maps'>
      <GoogleMapsLogo src={GoogleMapsLogoImageUrl} />
    </ExternalLink>
  );
};

export const CaltopoLink = ({lat, long}: {lat: number, long: number}) => {
  const caltopoUrl = `https://caltopo.com/map.html#ll=${lat},${long}&z=15`;
  return (
    <ExternalLink href={caltopoUrl} target='_blank' rel='noopener' title='Caltopo'>
      <CaltopoLogo src={CaltopoLogoImageUrl} />
    </ExternalLink>
  );
};

export const AllTrailsLink = ({lat, long, text}: {lat: number, long: number, text: string | undefined}) => {
  const latDistance = 0.1;
  const longDistance = 0.2;
  // tslint:disable-next-line:max-line-length
  const allTrailsUrl = `https://www.alltrails.com/explore?b_tl_lat=${lat - latDistance}&b_tl_lng=${long - longDistance}&b_br_lat=${lat + latDistance}&b_br_lng=${long + longDistance}`;
  const additionalText = text && text.length ? <TextContainer>{text}</TextContainer> : null;
  return (
    <ExternalLink href={allTrailsUrl} target='_blank' rel='noopener' title='AllTrails'>
      {additionalText}
      <CaltopoLogo src={AllTrailsLogoImageUrl} />
    </ExternalLink>
  );
};

interface HikingProjectStates {
  'alabama': 8006784;
  'alaska': 8006825;
  'arizona': 8006911;
  'arkansas': 8007054;
  'california': 8007121;
  'colorado': 8007418;
  'connecticut': 8007566;
  'delaware': 8007678;
  'florida': 8007709;
  'georgia': 8007899;
  'hawaii': 8007980;
  'idaho': 8008046;
  'illinois': 8008095;
  'indiana': 8008178;
  'iowa': 8008217;
  'kansas': 8008293;
  'kentucky': 8008333;
  'louisiana': 8008394;
  'maine': 8008431;
  'maryland': 8008490;
  'massachusetts': 8008552;
  'michigan': 8008690;
  'minnesota': 8008797;
  'mississippi': 8008885;
  'missouri': 8008930;
  'montana': 8009001;
  'nebraska': 8009077;
  'nevada': 8009101;
  'new-hampshire': 8009200;
  'new-jersey': 8009265;
  'new-mexico': 8009312;
  'new-york': 8009404;
  'north-carolina': 8009607;
  'north-dakota': 8009672;
  'ohio': 8009705;
  'oklahoma': 8009794;
  'oregon': 8009849;
  'pennsylvania': 8009971;
  'rhode-island': 8010144;
  'south-carolina': 8010166;
  'south-dakota': 8010224;
  'tennessee': 8010292;
  'texas': 8010374;
  'utah': 8010491;
  'vermont': 8010585;
  'virginia': 8010665;
  'washington': 8010742;
  'west-virginia': 8010938;
  'wisconsin': 8010991;
  'wyoming': 8011070;
}

const hikingProjectStates: HikingProjectStates = {
  'alabama': 8006784,
  'alaska': 8006825,
  'arizona': 8006911,
  'arkansas': 8007054,
  'california': 8007121,
  'colorado': 8007418,
  'connecticut': 8007566,
  'delaware': 8007678,
  'florida': 8007709,
  'georgia': 8007899,
  'hawaii': 8007980,
  'idaho': 8008046,
  'illinois': 8008095,
  'indiana': 8008178,
  'iowa': 8008217,
  'kansas': 8008293,
  'kentucky': 8008333,
  'louisiana': 8008394,
  'maine': 8008431,
  'maryland': 8008490,
  'massachusetts': 8008552,
  'michigan': 8008690,
  'minnesota': 8008797,
  'mississippi': 8008885,
  'missouri': 8008930,
  'montana': 8009001,
  'nebraska': 8009077,
  'nevada': 8009101,
  'new-hampshire': 8009200,
  'new-jersey': 8009265,
  'new-mexico': 8009312,
  'new-york': 8009404,
  'north-carolina': 8009607,
  'north-dakota': 8009672,
  'ohio': 8009705,
  'oklahoma': 8009794,
  'oregon': 8009849,
  'pennsylvania': 8009971,
  'rhode-island': 8010144,
  'south-carolina': 8010166,
  'south-dakota': 8010224,
  'tennessee': 8010292,
  'texas': 8010374,
  'utah': 8010491,
  'vermont': 8010585,
  'virginia': 8010665,
  'washington': 8010742,
  'west-virginia': 8010938,
  'wisconsin': 8010991,
  'wyoming': 8011070,
};

export const generateHikingProjectLink = (state: string | null) => {
  if (state) {
    const formattedState = state.toLowerCase().replace(/ /g, '-') as keyof HikingProjectStates;
    return `https://www.hikingproject.com/directory/${hikingProjectStates[formattedState]}`;
  } else {
    return 'https://www.hikingproject.com/';
  }
};
