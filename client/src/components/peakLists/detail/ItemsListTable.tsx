import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import {
  CheckboxInput,
  secondaryColor,
} from '../../../styling/styleUtils';
import {PeakListVariants} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import ItemTable, {Item, KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';

const UtilityBar = styled.div`
  display: flex;
`;

const CheckboxRoot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem 0 0.5rem 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.75rem;
  cursor: pointer;
  padding-left: 1rem;
  color: ${secondaryColor};
`;

interface Props {
  peakListId: string;
  items: Item[];
  dataFieldKeys: KeySortPair[];
  completionFieldKeys: KeySortPair[];
  type: CoreItem;
  variant: PeakListVariants;
  hasOptionalItems: boolean;
}

const storageCheckedKeyId = (type: string) => 'localstorageKeyForOptionalCheckedItems_' + type;

const ItemsListTable = (props: Props) => {
  const {items, dataFieldKeys, completionFieldKeys, type, variant, hasOptionalItems} = props;

  const initialChecked = localStorage.getItem(storageCheckedKeyId(type));

  const [checked, setChecked] = useState<boolean>(initialChecked === 'false' ? false : true);

  const onChange = useCallback(() => {
    localStorage.setItem(storageCheckedKeyId(type), (!checked).toString());
    setChecked(curr => !curr);
  }, [checked, setChecked, type]);

  const optionalCheckbox = hasOptionalItems ? (
    <CheckboxRoot>
      <CheckboxInput
        type='checkbox'
        id={`checkbox-show-optional-${type}`}
        checked={checked}
        onChange={onChange}
      />
      <CheckboxLabel htmlFor={`checkbox-show-optional-${type}`}>*Show optional {type}s</CheckboxLabel>
    </CheckboxRoot>
  ) : null;

  const filteredItems = checked ? items : items.filter(item => !item.optional);

  return (
    <>
      <UtilityBar>
        {optionalCheckbox}
      </UtilityBar>
      <ItemTable
        showIndex={true}
        items={filteredItems}
        dataFieldKeys={dataFieldKeys}
        completionFieldKeys={completionFieldKeys}
        actionFieldKeys={[]}
        type={type}
        variant={variant}
      />
    </>
  );
};

export default ItemsListTable;
