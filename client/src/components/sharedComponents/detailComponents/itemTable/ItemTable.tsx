import orderBy from 'lodash/orderBy';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {lightBorderColor} from '../../../../styling/styleUtils';
import ItemRow from './ItemRow';
import TableHeaderCell from './TableHeaderCell';

const Root = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Row = styled.tr`
  border-top: 1px solid ${lightBorderColor};
  border-bottom: 1px solid ${lightBorderColor};
`;

interface Item {
  id: string;
  name: string;
  destination?: string | (() => void);
  [key: string]: any;
}

export interface KeySortPair {
  displayKey: string;
  sortKey: string | null;
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
  const getString = useFluent();
  const [sorting, setSorting] = useState<{field: string, asc: boolean}>({field: 'name', asc: false});

  const toggleSorting = useCallback((field: string) => {
    setSorting(cur => {
      if (cur.field === field) {
        return {field: cur.field, asc: !cur.asc};
      } else {
        return {field, asc: cur.asc};
      }
    });
  }, [setSorting]);

  const rows = orderBy(items, [sorting.field], [sorting.asc ? 'asc' : 'desc']).map((item, i) => {
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
  const dataFieldHeaders = dataFieldKeys.map(({label, sortKey}) => (
    <TableHeaderCell
      key={'item-table-header-' + label}
      label={label}
      toggleSorting={toggleSorting}
      sortField={sortKey}
      isSorting={sorting.field === sortKey}
      sortAsc={sorting.asc}
    />
  ));
  const actionFieldHeaders = actionFieldKeys.map(({label, sortKey}) => (
    <TableHeaderCell
      key={'item-table-header-' + label}
      label={label}
      toggleSorting={toggleSorting}
      sortField={sortKey}
      isSorting={sorting.field === sortKey}
      sortAsc={sorting.asc}
    />
  ));

  return (
    <Root>
      <thead>
        <Row>
          {indexHeader}
          <TableHeaderCell
            label={getString('global-text-value-name')}
            toggleSorting={toggleSorting}
            sortField='name'
            isSorting={sorting.field === 'name'}
            sortAsc={sorting.asc}
            align={'left'}
          />
          {dataFieldHeaders}
          {actionFieldHeaders}
        </Row>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Root>
  );
};

export default ItemTable;
