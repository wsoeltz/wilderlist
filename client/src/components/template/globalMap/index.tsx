import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import initMap from './map';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapContext, {MapState} from '../../../contextProviders/mapContext';

const Root = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

const GlobalMap = ({children}: {children: React.ReactNode}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mapState, setMapState] = useState<MapState>({intialized: false})

  useEffect(() => {
    const container = rootRef.current;
    if (container && !mapState.intialized) {
      setMapState({intialized: true, ...initMap({container})});
    }
  }, [rootRef, mapState])

  return (
    <>
      <Root ref={rootRef} />
      <MapContext.Provider value={mapState}>
        {children}
      </MapContext.Provider>
    </>
  )
}

export default GlobalMap;
