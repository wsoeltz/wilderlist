import {faSort, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback} from 'react';
import styled from 'styled-components/macro';
import {
  ItemTitle,
} from '../../../../styling/sharedContentStyles';
import {
  BasicIconAtEndOfText,
} from '../../../../styling/styleUtils';

const Cell = styled.th<{$sortable: boolean, $align?: 'left' | 'right' | 'center'}>`
  ${({$sortable}) => $sortable ? 'cursor: pointer;' : ''}
  text-align: ${({$align}) => $align ? $align : 'center'};
  padding: 0.5rem 0.45rem 0;
`;

const SortIconContainer = styled.div`
  position: relative;
  display: inline-block;
  height: 0.7rem;
`;

const Icon = styled(BasicIconAtEndOfText)`
  position: absolute;
  right: -0.85rem;
  top: 0;
`;

const IconBackground = styled(Icon)`
  opacity: 0.35;
`;

interface Props {
  toggleSorting: ((sortField: string) => void) | null;
  sortField: string | null;
  label: string;
  isSorting?: boolean;
  sortAsc?: boolean;
  align?: 'left' | 'right' | 'center';
}

const TableHeaderCell = (props: Props) => {
  const {
    toggleSorting, label, sortField, isSorting, sortAsc, align,
  } = props;

  const sortable = Boolean(toggleSorting && sortField !== null);

  const onClick = useCallback(() => {
    if (toggleSorting && sortField !== null) {
      toggleSorting(sortField);
    }
  }, [toggleSorting, sortField]);

  const iconForeground = !isSorting
    ? null
    : (sortAsc ? <Icon icon={faSortUp} /> : <Icon icon={faSortDown} />);

  const sortIcon = sortable ? (
    <SortIconContainer>
      {iconForeground}
      <IconBackground icon={faSort} />
    </SortIconContainer>
  ) : null;

  return (
    <Cell
      onClick={onClick}
      $sortable={sortable}
      $align={align}
    >
      <ItemTitle>
        {label}
        {sortIcon}
      </ItemTitle>
    </Cell>
  );
};

export default React.memo(TableHeaderCell);
