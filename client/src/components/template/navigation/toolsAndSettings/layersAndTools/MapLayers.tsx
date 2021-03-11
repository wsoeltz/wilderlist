import {
  faCloud,
  faExchangeAlt,
  faThermometerEmpty,
  faTint,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import SatelliteMapLayerBG from '../../../../../assets/images/satellite-map-layer-icon-bg.jpg';
import StandardMapLayerBG from '../../../../../assets/images/standard-map-layer-icon-bg.jpg';
import {
  lightBaseColor,
  lightBorderColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {mobileSize} from '../../../../../Utils';

const Grid = styled.div`
  margin: 0;
  padding: 0 0.35rem 0.35rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;

  &:not(:last-of-type) {
    border-bottom: solid 1px ${lightBorderColor};
  }

  @media (max-width: ${mobileSize}px) {
    grid-template-columns: unset;
    grid-auto-flow: column;
    grid-auto-columns: 5rem;
    grid-template-rows: auto 1fr;
    grid-column-gap: 1rem;
    margin: auto 0;

    &:last-of-type {
      padding-left: 1rem;
    }
    &:not(:last-of-type) {
      border-bottom: none;
      border-right: solid 1px ${lightBorderColor};
      padding-right: 1rem;
    }
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  text-transform: uppercase;
  font-size: 0.7rem;
  margin-bottom: 0.4rem;

  @media (max-width: ${mobileSize}px) {
    grid-row: 2;
  }
`;

const Thumnbail = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 2.75rem;
  border: solid 2px transparent;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
  margin-bottom: 0.25rem;

  @media (max-width: ${mobileSize}px) {
    height: 4rem;
  }
`;

const IconThumbnail = styled(Thumnbail)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${lightBaseColor};
  height: 2.25rem;
  background-color: ${tertiaryColor};
  border-color: ${lightBorderColor};

  @media (max-width: ${mobileSize}px) {
    height: 4rem;
  }
`;

const Title = styled.div`
  grid-column: 1 / 3;
  grid-row: 1;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  font-weight: 600;

  @media (max-width: ${mobileSize}px) {
    padding-top: 0.25rem;
  }
`;

const MapLayers = () => {
  return (
    <>
      <Grid>
        <Title>Base Maps</Title>
        <Button>
          <Thumnbail style={{backgroundImage: `url("${StandardMapLayerBG}")`}} />
          {'Standard'}
        </Button>
        <Button>
          <Thumnbail style={{backgroundImage: `url("${SatelliteMapLayerBG}")`}} />
          {'Satellite'}
        </Button>
      </Grid>
      <Grid>
        <Title>Weather Overlays</Title>
        <Button>
          <IconThumbnail />
          {'None'}
        </Button>
        <Button>
          <IconThumbnail>
            <FontAwesomeIcon icon={faTint} />
          </IconThumbnail>
          {'Precip.'}
        </Button>
        <Button>
          <IconThumbnail>
            <FontAwesomeIcon icon={faExchangeAlt} />
          </IconThumbnail>
          {'Pressure'}
        </Button>
        <Button>
          <IconThumbnail>
            <FontAwesomeIcon icon={faThermometerEmpty} />
          </IconThumbnail>
          {'Temp.'}
        </Button>
        <Button>
          <IconThumbnail>
            <FontAwesomeIcon icon={faWind} />
          </IconThumbnail>
          {'Wind'}
        </Button>
        <Button>
          <IconThumbnail>
            <FontAwesomeIcon icon={faCloud} />
          </IconThumbnail>
          {'Clouds'}
        </Button>
      </Grid>
    </>
  );
};

export default MapLayers;
