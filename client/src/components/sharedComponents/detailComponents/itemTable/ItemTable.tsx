import React from 'react';
import ItemRow from './ItemRow';
import styled from 'styled-components/macro';

const Root = styled.table`
`;

interface Item {
  id: string;
  name: string;
  destination?: string | (() => void);
  [key: string]: any;
}

export interface KeySortPair {
  displayKey: string;
  sortKey: string;
  label: string;
}

interface Props {
  items: Item[];
  dataFieldKeys: KeySortPair[];
  actionFieldKeys: KeySortPair[];
  showIndex?: boolean;
}

const ItemTable = (props: Props) => {
  const {items, showIndex, dataFieldKeys, actionFieldKeys} = props;

  const rows = items.map((item, i) => {
    const dataFields = dataFieldKeys.map(({displayKey}) => item[displayKey]);
    const actionFields = actionFieldKeys.map(({displayKey}) => item[displayKey]);
    return (
      <ItemRow
        key={'item-row-' + item.id + i}
        index={showIndex ? i + 1 : undefined}
        name={item.name}
        destination={item.destination}
        dataFields={dataFields}
        completionFields={[]}
        actionFields={actionFields}
      />
    );
  });

  const indexHeader = showIndex ? <th /> : null;
  const dataFieldHeaders = dataFieldKeys.map(({label}) => (
    <th key={'item-table-header-' + label}>{label}</th>
  ));
  const actionFieldHeaders = actionFieldKeys.map(({label}) => (
    <th key={'item-table-header-' + label}>{label}</th>
  ));

  return (
    <Root>
      <thead>
        <tr>
          {indexHeader}
          <th>Name</th>
          {dataFieldHeaders}
          {actionFieldHeaders}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Root>
  );
}

export default ItemTable;
