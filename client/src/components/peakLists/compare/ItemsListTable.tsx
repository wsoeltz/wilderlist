import React from 'react';
import {PeakListVariants} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import ItemTable, {Item, KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';

interface Props {
  items: Item[];
  dataFieldKeys: KeySortPair[];
  completionFieldKeys: KeySortPair[];
  type: CoreItem;
  variant: PeakListVariants;
}

const ItemsListTable = (props: Props) => {
  const {
    dataFieldKeys, completionFieldKeys, type, variant,
    items,
  } = props;

  return (
    <ItemTable
      showIndex={true}
      items={items}
      dataFieldKeys={dataFieldKeys}
      completionFieldKeys={completionFieldKeys}
      actionFieldKeys={[]}
      type={type}
      variant={variant}
    />
  );
};

export default ItemsListTable;
