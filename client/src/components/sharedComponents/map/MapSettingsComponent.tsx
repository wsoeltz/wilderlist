import debounce from 'lodash/debounce';
import React, {useEffect, useState} from 'react';

export interface Settings {
  fillSpace: boolean | undefined;
  setCenterCoords: (coords: [string, string]) => void;
  showOtherMountains: boolean;
  showNearbyTrails: boolean;
  showCenterCrosshairs: boolean;
}

interface Props extends Settings {
  map: any;
}

const latLngDecimalPoints = 8;

const MapSettingsComponent = (props: Props) => {
  const [haveSettingsBeenSet, setSettings] = useState<boolean>(false);

  useEffect(() => {
    const {
      map, fillSpace, setCenterCoords,
      showOtherMountains, showNearbyTrails, showCenterCrosshairs,
    } = props;
    const enableZoom = (e: KeyboardEvent) => {
      if (e.shiftKey && map && fillSpace === false) {
        map.scrollZoom.enable();
      }
    };
    const disableZoom = () => {
      if (map && fillSpace === false) {
        map.scrollZoom.disable();
      }
    };
    const disableDragPanOnTouchDevics = () => {
      if (map && fillSpace === false) {
        map.dragPan.disable();
      }
    };
    const getPreciseCenterCoords = debounce(() => {
      if (map) {
        const {lat, lng}: {lat: number, lng: number} = map.getCenter();
        setCenterCoords([lat.toFixed(latLngDecimalPoints), lng.toFixed(latLngDecimalPoints)]);
      }
    }, 250);
    if (map && haveSettingsBeenSet === false) {
      document.body.addEventListener('keydown', enableZoom);
      document.body.addEventListener('keyup', disableZoom);
      document.body.addEventListener('touchstart', disableDragPanOnTouchDevics);

      if (showOtherMountains || showNearbyTrails || showCenterCrosshairs) {
        map.on('dragend', getPreciseCenterCoords);
        map.on('zoomend', getPreciseCenterCoords);
      }
      setSettings(true);
    }
    return () => {
      document.body.removeEventListener('keydown', enableZoom);
      document.body.removeEventListener('keyup', disableZoom);
      document.body.removeEventListener('touchstart', disableDragPanOnTouchDevics);
      if (map && (showOtherMountains || showNearbyTrails || showCenterCrosshairs)) {
        map.off('dragend', getPreciseCenterCoords);
        map.off('zoomend', getPreciseCenterCoords);
        // destroy the map on unmount
        map.remove();
      }
    };
  }, [props, haveSettingsBeenSet]);

  return <React.Fragment />;
};

export default MapSettingsComponent;
