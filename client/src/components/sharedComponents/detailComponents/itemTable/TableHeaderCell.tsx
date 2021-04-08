import {faSort, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback} from 'react';
import styled from 'styled-components/macro';
import {
  ItemTitle,
} from '../../../../styling/sharedContentStyles';
import {
  BasicIconAtEndOfText,
} from '../../../../styling/styleUtils';

const Cell = styled.th<{$sortable: boolean, $align?: 'left' | 'right' | 'center', $compact: boolean}>`
  ${({$sortable}) => $sortable ? 'cursor: pointer;' : ''}
  text-align: ${({$align}) => $align ? $align : 'center'};
  background-color: #fff;
  padding: ${({$compact}) => !$compact ? '0.5rem 1rem 0 0.45rem' : '0.5rem 0.5rem 0 0.45rem'};
  position: sticky;
  top: -1px;
  height: 2rem;
  box-sizing: border-box;
  z-index: 10;
  white-space: nowrap;
`;

const SortIconContainer = styled.div`
  position: relative;
  display: inline-block;
  height: 0.7rem;
`;

const Icon = styled(BasicIconAtEndOfText)<{$compact: boolean}>`
  position: absolute;
  right: ${({$compact}) => !$compact ? '-0.85rem' : '-0.5rem'};
  top: ${({$compact}) => !$compact ? 0 : '0.15rem'};;
`;

const IconBackground = styled(Icon)`
  opacity: 0.2;
`;

interface Props {
  toggleSorting: ((sortField: string) => void) | null;
  sortField: string | null;
  label: string;
  isSorting?: boolean;
  sortAsc?: boolean;
  align?: 'left' | 'right' | 'center';
  compactView: boolean;
}

const TableHeaderCell = (props: Props) => {
  const {
    toggleSorting, label, sortField, isSorting, sortAsc, align, compactView,
  } = props;

  const sortable = Boolean(toggleSorting && sortField !== null);

  const onClick = useCallback(() => {
    if (toggleSorting && sortField !== null) {
      toggleSorting(sortField);
    }
  }, [toggleSorting, sortField]);

  const iconForeground = !isSorting
    ? null
    : (sortAsc ? <Icon $compact={compactView} icon={faSortUp} /> : <Icon $compact={compactView} icon={faSortDown} />);

  const sortIcon = sortable ? (
    <SortIconContainer>
      {iconForeground}
      <IconBackground $compact={compactView} icon={faSort} />
    </SortIconContainer>
  ) : null;

  return (
    <Cell
      onClick={onClick}
      $sortable={sortable}
      $align={align}
      $compact={compactView}
    >
      <ItemTitle style={{fontSize: compactView ? '0.65rem' : undefined}}>
        {label}
        {sortIcon}
      </ItemTitle>
    </Cell>
  );
};

export default React.memo(TableHeaderCell);
