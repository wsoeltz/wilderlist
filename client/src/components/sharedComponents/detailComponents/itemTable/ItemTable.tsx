import orderBy from 'lodash/orderBy';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {lightBorderColor} from '../../../../styling/styleUtils';
import {CoreItem} from '../../../../types/itemTypes';
import StandardSearch from '../../StandardSearch';
import ItemRow from './ItemRow';
import TableHeaderCell from './TableHeaderCell';

const Root = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Row = styled.tr`
  border-top: 1px solid ${lightBorderColor};
`;

const IndexHeader = styled.th`
  position: sticky;
  top: -1px;
  background-color: #fff;
  height: 2rem;
  box-sizing: border-box;
`;

const SearchCell = styled.th`
  position: sticky;
  top: calc(2rem - 1px);
  background-color: #fff;
  padding: 0;

  input {
    border-left: none;
    border-right: none;
    font-size: 0.9rem;
    box-shadow: none;
  }
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
  type: CoreItem;
}

const ItemTable = (props: Props) => {
  const {items, showIndex, dataFieldKeys, actionFieldKeys, type} = props;
  const getString = useFluent();
  const [filterQuery, setFilterQuery] = useState<string>('');
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

  const rows = orderBy(items, [sorting.field], [sorting.asc ? 'asc' : 'desc'])
    .filter(item => item.name.toLowerCase().includes(filterQuery))
    .map((item, i) => {
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

  const indexHeader = showIndex ? <IndexHeader /> : null;
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

  let totalColumns = dataFieldHeaders.length + actionFieldHeaders.length + 1; // + 1 for name column
  if (showIndex) {
    totalColumns += 1;
  }

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
        <tr>
          <SearchCell colSpan={totalColumns}>
            <StandardSearch
              placeholder={getString('global-text-value-fitler-items', {type})}
              setSearchQuery={setFilterQuery}
              initialQuery={filterQuery}
              focusOnMount={false}
              noSearchIcon={true}
            />
          </SearchCell>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Root>
  );
};

export default ItemTable;
