import React from 'react';
import {Link} from 'react-router-dom';
import { LinkButton } from '../../../../styling/styleUtils';

interface Props {
  index?: number | undefined;
  name: string;
  destination?: string | (() => void);
  dataFields: (string | number)[]
  completionFields: Array<{
    value: string;
    onClick: null | (() => void);
  }>;
  actionFields: React.ReactNode[]
}

const ItemRow = (props: Props) => {
  const {
    index, name, destination, dataFields, completionFields, actionFields,
  } = props;

  const indexColumn = index !== undefined ? <td>{index}</td> : null;

  let nameColumn: React.ReactElement<any>
  if (destination !== undefined) {
    if (typeof destination === 'string') {
      nameColumn = <td><Link to={destination}>{name}</Link></td>;
    } else if (typeof destination === 'function') {
      nameColumn = <td><LinkButton onClick={destination}>{name}</LinkButton></td>;
    } else {
      nameColumn = <td>{name}</td>;
    }
  } else {
    nameColumn = <td>{name}</td>;
  }

  const dataColumns = dataFields.map((value, i) => <td key={'item-list-data-td-' + name + value + i}>{value}</td>)
  const completionColumns = completionFields.map(({value, onClick}, i) => {
    if (onClick === null) {
      return <td key={'item-list-completion-td-' + name + value + i}>{value}</td>;
    } else {
      return (
        <td key={'item-list-completion-button-' + name + value + i}>
          <LinkButton
            key={'item-list-completion-button-td-' + name + value + i}
            onClick={onClick}
          >
            {value}
          </LinkButton>
        </td>
      );
    }
  });

  const actionColumns = actionFields.map((n, i) => <td key={'item-list-action-node-td-' + name + i}>{n}</td>)

  return (
    <tr>
      {indexColumn}
      {nameColumn}
      {dataColumns}
      {completionColumns}
      {actionColumns}
    </tr>
  );
}

export default ItemRow;
