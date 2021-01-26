import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import { LinkButton } from '../../../../styling/styleUtils';
import {
  lightBorderColor,
  SemiBold,
} from '../../../../styling/styleUtils';

const Row = styled.tr`
  border-bottom: 1px solid ${lightBorderColor};
  background-color: #f8f8f8;
  font-size: 0.85rem;
`;

const IndexCell = styled.td`
  padding: 0.35rem 0 0.35rem 0.3rem;
`;

const BaseCell = styled.td`
  padding: 0.35rem 0.45rem;
`;

const InnerCell = styled(BaseCell)`
  text-align: center;
`;

interface Props {
  index?: number | undefined;
  name: string;
  destination?: string | (() => void);
  dataFields: Array<string | number>;
  completionFields: Array<{
    value: string;
    onClick: null | (() => void);
  }>;
  actionFields: React.ReactNode[];
}

const ItemRow = (props: Props) => {
  const {
    index, name, destination, dataFields, completionFields, actionFields,
  } = props;

  const indexColumn = index !== undefined ? <IndexCell>{index}</IndexCell> : null;

  let nameColumn: React.ReactElement<any>;
  if (destination !== undefined) {
    if (typeof destination === 'string') {
      nameColumn = (
        <BaseCell>
          <Link to={destination}>
            <SemiBold>{name}</SemiBold>
          </Link>
        </BaseCell>
      );
    } else if (typeof destination === 'function') {
      nameColumn = (
        <BaseCell>
          <LinkButton onClick={destination}>
            <SemiBold>{name}</SemiBold>
          </LinkButton>
        </BaseCell>
      );
    } else {
      nameColumn = (
        <BaseCell>
          <SemiBold>{name}</SemiBold>
        </BaseCell>
      );
    }
  } else {
    nameColumn = (
      <BaseCell>
        <SemiBold>{name}</SemiBold>
      </BaseCell>
    );
  }

  const dataColumns = dataFields.map((value, i) => (
    <InnerCell key={'item-list-data-td-' + name + value + i}>{value}</InnerCell>
  ));
  const completionColumns = completionFields.map(({value, onClick}, i) => {
    if (onClick === null) {
      return <InnerCell key={'item-list-completion-td-' + name + value + i}>{value}</InnerCell>;
    } else {
      return (
        <InnerCell key={'item-list-completion-button-' + name + value + i}>
          <LinkButton
            key={'item-list-completion-button-td-' + name + value + i}
            onClick={onClick}
          >
            {value}
          </LinkButton>
        </InnerCell>
      );
    }
  });

  const actionColumns = actionFields.map((n, i) => (
    <InnerCell key={'item-list-action-node-td-' + name + i}>{n}</InnerCell>
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
