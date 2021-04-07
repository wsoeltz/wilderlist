import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  CheckboxInput,
  HelpUnderline,
  secondaryColor,
} from '../../../styling/styleUtils';
import {PeakListVariants} from '../../../types/graphQLTypes';
import {CoreItem} from '../../../types/itemTypes';
import ItemTable, {Item, KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import Tooltip from '../../sharedComponents/Tooltip';
import ExportButton from '../export/ExportButton';
import ImportButton from '../import/ImportButton';

const UtilityBar = styled.div`
  display: flex;
  padding: 0.5rem 0 0.5rem 1rem;
  align-items: center;
`;

const GridNoteText = styled.div`
  padding: 0.25rem 1rem 1.25rem;
  font-size: 0.7rem;
`;

const SoloUtilityBar = styled(UtilityBar)`
  padding-top: 0;
`;

const Checkbox = styled(CheckboxInput)`
  left: 0;
`;

const CheckboxRoot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem 0.5rem 0;
  margin-left: auto;
`;

const CheckboxLabel = styled.label`
  font-size: 0.75rem;
  cursor: pointer;
  padding-left: 1.5rem;
  color: ${secondaryColor};
  position: relative;

  &:before {
    content: '*';
    position: absolute;
    transform: translate(-100%);
  }
`;

interface Props {
  peakListId: string;
  items: Item[];
  dataFieldKeys: KeySortPair[];
  completionFieldKeys: KeySortPair[];
  stringDateFields: KeySortPair[];
  type: CoreItem;
  variant: PeakListVariants;
  hasOptionalItems: boolean;
  soloPanel: boolean;
}

const storageCheckedKeyId = (type: string) => 'localstorageKeyForOptionalCheckedItems_' + type;

const ItemsListTable = (props: Props) => {
  const {
    peakListId, items, dataFieldKeys, completionFieldKeys, type, variant, hasOptionalItems,
    soloPanel, stringDateFields,
  } = props;

  const getString = useFluent();

  const initialChecked = localStorage.getItem(storageCheckedKeyId(type));

  const [checked, setChecked] = useState<boolean>(initialChecked === 'false' ? false : true);

  const onChange = useCallback(() => {
    localStorage.setItem(storageCheckedKeyId(type), (!checked).toString());
    setChecked(curr => !curr);
  }, [checked, setChecked, type]);

  const optionalCheckbox = hasOptionalItems ? (
    <CheckboxRoot>
        <Checkbox
          type='checkbox'
          id={`checkbox-show-optional-${type}`}
          checked={checked}
          onChange={onChange}
        />
        <CheckboxLabel htmlFor={`checkbox-show-optional-${type}`}>
          <Tooltip
            explanation={getString('peak-list-detail-text-optional-items-desc', {type})}
            compactI={true}
            cursor={'pointer'}
          >
            <HelpUnderline>
              {getString('peak-list-detail-text-optional-toggle', {type})}
            </HelpUnderline>
          </Tooltip>
        </CheckboxLabel>
    </CheckboxRoot>
  ) : null;

  const filteredItems = checked ? items : items.filter(item => !item.optional);

  const importButton = type === CoreItem.mountain ? (
    <ImportButton
      peakListId={peakListId}
      variant={variant}
      mountains={items as any}
    />
  ) : null;

  const UtilityBarRoot = soloPanel ? SoloUtilityBar : UtilityBar;
  const gridText = variant === PeakListVariants.grid
    ? (
      <GridNoteText
        dangerouslySetInnerHTML={{__html: getString('mountain-table-grid-date-note-text') }}
      />
    ) : null;

  return (
    <>
      <UtilityBarRoot>
        <ExportButton
          items={items}
          dataFieldKeys={dataFieldKeys}
          stringDateFields={stringDateFields}
          peakListId={peakListId}
        />
        {importButton}
        {optionalCheckbox}
      </UtilityBarRoot>
      {gridText}
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
