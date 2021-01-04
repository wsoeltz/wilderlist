import { GetString } from 'fluent-react/compat';
import React from 'react';
import {ItemType} from '../../interactions';

interface Props {
  id: string;
  itemType: ItemType;
  getString: GetString;
}

const LastAscent = ({getString, itemType}: Props) => {
  return (
    <>
      <div>{getString('last-trip-dynamic', {type: itemType})}</div>
    </>
  );
};

export default LastAscent;
