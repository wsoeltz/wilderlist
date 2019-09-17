import { GetString } from 'fluent-react';
import L from 'leaflet';
import React, {useContext, useEffect} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import icon from './images/marker-icon.png';
import iconShadow from './images/marker-shadow.png';
import './leaflet.css';
import './leaflet.custom.css';

const Root = styled.div`
  margin: 2rem 0;
`;

const ScrollAssistance = styled.div`
  font-size: 0.8rem;
  text-align: center;
  margin: 0.9rem 0;
`;

const MapDiv = styled.div`
  height: 500px;
  width: 100%;
  overflow: hidden;
`;

interface Coordinate {
  latitude: number;
  longitude: number;
  name: string;
  elevation: number;
}

const defaultCoordinates = {
  latitude: 43.216461,
  longitude: -73.5346381,
};

interface Props {
  id: string;
  coordinates: Coordinate[];
}

const Map = (props: Props) => {
  const { id, coordinates} = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const mapid = `map-${id}`;
  const attribution =  getFluentString('map-text-attribution');

  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
    });

    const startLatitude = defaultCoordinates.latitude;
    const startLongitude = defaultCoordinates.longitude;

    const map = L.map(mapid).setView([startLatitude, startLongitude], 7);
    map.scrollWheelZoom.disable();

    const enableScroll = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        map.scrollWheelZoom.enable();
      }
    };
    const disbleScroll = () => {
      map.scrollWheelZoom.disable();
    };

    disbleScroll();

    window.addEventListener('keydown', enableScroll);
    window.addEventListener('keyup', disbleScroll);

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution,
    }).addTo(map);

    L.Marker.prototype.options.icon = DefaultIcon;

    if (coordinates.length !== 0) {
      const markers = coordinates.map(({name, latitude, longitude, elevation}) => {
        const circle = L.circle([latitude, longitude], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 50,
        }).addTo(map);
        circle.bindPopup(`<strong>${name}</strong><br />${elevation}ft`);
        return circle;
      });

      const group = new L.featureGroup([...markers]);
      map.fitBounds(group.getBounds());
      if (coordinates.length === 1) {
        map.setZoom(14);
      }

    }
    return () => {
      map.off();
      map.remove();
      window.removeEventListener('keydown', enableScroll);
      window.removeEventListener('keydown', disbleScroll);
    };
  }, [mapid, coordinates, attribution]);

  return (
    <Root>
      <MapDiv id={mapid} />
      <ScrollAssistance
        dangerouslySetInnerHTML={{__html: getFluentString('map-text-scroll-with-shift-help')}}
      />
    </Root>
  );
};

export default Map;