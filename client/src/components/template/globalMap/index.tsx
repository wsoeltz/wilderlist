import 'mapbox-gl/dist/mapbox-gl.css';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import MapContext, {MapState} from '../../../contextProviders/mapContext';
import useFluent from '../../../hooks/useFluent';
import useUsersLocation from '../../../hooks/useUsersLocation';
import {Routes} from '../../../routing/routes';
import initMap from './map';

const Root = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

const GlobalMap = ({children}: {children: React.ReactNode}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mapState, setMapState] = useState<MapState>({intialized: false});
  const {location: initialCenter} = useUsersLocation();
  const {push} = useHistory();
  const getString = useFluent();

  useEffect(() => {
    const container = rootRef.current;
    if (container && !mapState.intialized && getString) {
      const mapOutput = initMap({container, push, getString});
      setMapState({intialized: true, ...mapOutput});
    }
  }, [rootRef, mapState, push, getString]);

  useEffect(() => {
    if (mapState.intialized === true && mapState.map && initialCenter !== undefined) {
      if (window.location.pathname === Routes.Landing ||
          window.location.pathname === Routes.Dashboard ||
          window.location.pathname === Routes.SearchLists ||
          window.location.pathname === Routes.SearchMountains ||
          window.location.pathname === Routes.SearchCampsites ||
          window.location.pathname === Routes.SearchTrails ||
          window.location.pathname === Routes.UserSettings ||
          window.location.pathname === Routes.PrivacyPolicy ||
          window.location.pathname === Routes.TermsOfUse ||
          window.location.pathname === Routes.YourStats ||
          window.location.pathname === Routes.About ||
          window.location.pathname === Routes.SearchUsers ||
          window.location.pathname === Routes.CreateList ||
          window.location.pathname === Routes.EditList
          ) {
        mapState.setNewCenter(initialCenter, 7);
      }
    }
  }, [mapState, initialCenter]);

  return (
    <>
      <Root ref={rootRef} />
      <MapContext.Provider value={mapState}>
        {children}
      </MapContext.Provider>
    </>
  );
};

export default GlobalMap;
