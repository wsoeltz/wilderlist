import React from 'react';
import styled from 'styled-components';
import CaltopoLogoImageUrl from '../assets/images/caltopo-logo.png';
import GoogleMapsLogoImageUrl from '../assets/images/google-maps-logo.png';

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
    <ExternalLink href={googleUrl} target='_blank'>
      <GoogleMapsLogo src={GoogleMapsLogoImageUrl} />
    </ExternalLink>
  );
};

export const CaltopoLink = ({lat, long}: {lat: number, long: number}) => {
  const caltopoUrl = `https://caltopo.com/map.html#ll=${lat},${long}`;
  return (
    <ExternalLink href={caltopoUrl} target='_blank'>
      <CaltopoLogo src={CaltopoLogoImageUrl} />
    </ExternalLink>
  );
};
