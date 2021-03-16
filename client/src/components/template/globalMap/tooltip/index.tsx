import React from 'react';
import { createPortal } from 'react-dom';
import {Coordinate} from '../../../../types/graphQLTypes';
import {CoreItems} from '../../../../types/itemTypes';
import ClickedPopup from './popup/ClickedPopup';

export type CallbackInput = {
  item: CoreItems;
  highlighted: boolean;
  datum: {
    [key: string]: any;
  };
};

export interface Props {
  node: HTMLElement | null;
  item?: CoreItems;
  id?: string | null;
  highlighted?: boolean;
  name?: string | null;
  location?: Coordinate;
  closePopup?: () => void;
  callback?: (input: CallbackInput) => void;
  highlightedPointsGeojson?: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
  highlightedTrailsGeojson?: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
  highlightedRoadsGeojson?: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
}

const Tooltip = (props: Props) => {
  const {
    node, item, id, name, location, closePopup, callback,
    highlightedPointsGeojson, highlightedTrailsGeojson, highlightedRoadsGeojson,
  } = props;

  let modal: React.ReactElement<any> | null;
  if (node !== null && item !== undefined && id !== undefined &&
      name !== undefined && location !== undefined && closePopup !== undefined) {
    modal = createPortal((
      <ClickedPopup
        name={name}
        id={id}
        itemType={item}
        location={location}
        close={closePopup}
        highlightedPointsGeojson={highlightedPointsGeojson}
        highlightedTrailsGeojson={highlightedTrailsGeojson}
        highlightedRoadsGeojson={highlightedRoadsGeojson}
        callback={callback}
      />
    ), node);
  } else {
    modal = null;
  }

  return modal;
};

export default Tooltip;
