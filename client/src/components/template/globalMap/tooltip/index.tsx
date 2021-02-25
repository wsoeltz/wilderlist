import React from 'react';
import { createPortal } from 'react-dom';
import {Coordinate} from '../../../../types/graphQLTypes';
import {CoreItems} from '../../../../types/itemTypes';
import ClickedPopup from './popup/ClickedPopup';

export interface Props {
  node: HTMLElement | null;
  item?: CoreItems;
  id?: string | null;
  name?: string | null;
  location?: Coordinate;
  closePopup?: () => void;
}

const Tooltip = (props: Props) => {
  const {
    node, item, id, name, location, closePopup,
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
      />
    ), node);
  } else {
    modal = null;
  }

  return modal;
};

export default Tooltip;
