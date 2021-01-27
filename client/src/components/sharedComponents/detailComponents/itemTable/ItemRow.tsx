import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import { LinkButton } from '../../../../styling/styleUtils';
import {
  lightBaseColor,
  lightBorderColor,
  SemiBold,
  tertiaryColor,
} from '../../../../styling/styleUtils';

const Row = styled.tr`
  border-bottom: 1px solid ${lightBorderColor};
  background-color: #f8f8f8;
  font-size: 0.85rem;

  &:hover {
    background-color: ${tertiaryColor};
  }
`;

const IndexCell = styled.td<{$compact: boolean}>`
  padding: 0.35rem 0 0.35rem 0.3rem;
  padding: ${({$compact}) => !$compact ?  '0.35rem 0 0.35rem 0.3rem' : '0.35rem 0 0.35rem 0.2rem'};
  font-size: ${({$compact}) => !$compact ?  '0.75rem' : '0.6rem'};
  color: ${lightBaseColor};
`;

const BaseCell = styled.td<{$compact: boolean}>`
  padding: ${({$compact}) => !$compact ?  '0.35rem 0.45rem' : '0.35rem 0.25rem'};
  ${({$compact}) => !$compact ?  '' : 'font-size: 0.75rem'};
`;

const InnerCell = styled(BaseCell)`
  text-align: center;
  font-size: ${({$compact}) => !$compact ?  '0.75rem' : '0.6rem'};
  color: ${lightBaseColor};
`;

interface Props {
  index?: number | undefined;
  name: string;
  destination?: string | (() => void);
  dataFields: Array<string | number>;
  completionFields: Array<string | React.ReactNode>;
  actionFields: React.ReactNode[];
  compactView: boolean;
}

const ItemRow = (props: Props) => {
  const {
    index, name, destination, dataFields, completionFields, actionFields, compactView,
  } = props;

  const indexColumn = index !== undefined ? <IndexCell $compact={compactView}>{index}</IndexCell> : null;

  let nameColumn: React.ReactElement<any>;
  if (destination !== undefined) {
    if (typeof destination === 'string') {
      nameColumn = (
        <BaseCell $compact={compactView}>
          <Link to={destination}>
            <SemiBold>{name}</SemiBold>
          </Link>
        </BaseCell>
      );
    } else if (typeof destination === 'function') {
      nameColumn = (
        <BaseCell $compact={compactView}>
          <LinkButton onClick={destination}>
            <SemiBold>{name}</SemiBold>
          </LinkButton>
        </BaseCell>
      );
    } else {
      nameColumn = (
        <BaseCell $compact={compactView}>
          <SemiBold>{name}</SemiBold>
        </BaseCell>
      );
    }
  } else {
    nameColumn = (
      <BaseCell $compact={compactView}>
        <SemiBold>{name}</SemiBold>
      </BaseCell>
    );
  }

  const dataColumns = dataFields.map((value, i) => (
    <InnerCell $compact={compactView} key={'item-list-data-td-' + name + value + i}>{value}</InnerCell>
  ));
  const completionColumns = completionFields.map((value, i) => (
    <InnerCell $compact={compactView} key={'item-list-completion-td-' + name + value + i}>{value}</InnerCell>
  ));
  const actionColumns = actionFields.map((n, i) => (
    <InnerCell $compact={compactView} key={'item-list-action-node-td-' + name + i}>{n}</InnerCell>
  ));

  return (
    <Row>
      {indexColumn}
      {nameColumn}
      {dataColumns}
      {completionColumns}
      {actionColumns}
    </Row>
  );
};

export default ItemRow;
