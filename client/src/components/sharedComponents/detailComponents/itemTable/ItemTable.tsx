import orderBy from 'lodash/orderBy';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {lightBorderColor} from '../../../../styling/styleUtils';
import {CoreItem} from '../../../../types/itemTypes';
import StandardSearch from '../../StandardSearch';
import ItemRow from './ItemRow';
import TableHeaderCell from './TableHeaderCell';

const Table = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  overflow-x: scroll;
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
  completionFieldKeys: KeySortPair[];
  showIndex?: boolean;
  type: CoreItem;
}

const ItemTable = (props: Props) => {
  const {items, showIndex, dataFieldKeys, actionFieldKeys, completionFieldKeys, type} = props;
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

  // + 1 for name column
  let totalColumns = dataFieldKeys.length + actionFieldKeys.length + completionFieldKeys.length + 1;
  if (showIndex) {
    totalColumns += 1;
  }

  const compactView = totalColumns > 6;

  const rows = orderBy(items, [sorting.field], [sorting.asc ? 'asc' : 'desc'])
    .filter(item => item.name.toLowerCase().includes(filterQuery))
    .map((item, i) => {
      const dataFields = dataFieldKeys.map(({displayKey}) => item[displayKey]);
      const completionFields = completionFieldKeys.map(({displayKey}) => item[displayKey]);
      const actionFields = actionFieldKeys.map(({displayKey}) => item[displayKey]);
      return (
        <ItemRow
          key={'item-row-' + item.id + i}
          index={showIndex ? i + 1 : undefined}
          name={item.name}
          destination={item.destination}
          dataFields={dataFields}
          completionFields={completionFields}
          actionFields={actionFields}
          compactView={compactView}
        />
      );
    });

  const indexHeader = showIndex ? <IndexHeader /> : null;
  const dataFieldHeaders = dataFieldKeys.map(({label, sortKey}) => (
    <TableHeaderCell
      key={'item-table-header-' + label + type}
      label={label}
      toggleSorting={toggleSorting}
      sortField={sortKey}
      isSorting={sorting.field === sortKey}
      sortAsc={sorting.asc}
      compactView={compactView}
    />
  ));
  const completionFieldHeaders = completionFieldKeys.map(({label, sortKey}) => (
    <TableHeaderCell
      key={'item-table-header-' + label + type}
      label={label}
      toggleSorting={toggleSorting}
      sortField={sortKey}
      isSorting={sorting.field === sortKey}
      sortAsc={sorting.asc}
      compactView={compactView}
    />
  ));
  const actionFieldHeaders = actionFieldKeys.map(({label, sortKey}) => (
    <TableHeaderCell
      key={'item-table-header-' + label + type}
      label={label}
      toggleSorting={toggleSorting}
      sortField={sortKey}
      isSorting={sorting.field === sortKey}
      sortAsc={sorting.asc}
      compactView={compactView}
    />
  ));

  return (
    <Table>
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
            compactView={compactView}
          />
          {dataFieldHeaders}
          {completionFieldHeaders}
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
    </Table>
  );
};

export default ItemTable;
