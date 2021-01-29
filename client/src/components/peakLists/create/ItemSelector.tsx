import {faMap} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {
  BasicIconInText,
  IconContainer,
  primaryColor,
} from '../../../styling/styleUtils';
import {CoreItem} from '../../../types/itemTypes';
import ItemTable, {KeySortPair} from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import Search from '../../sharedComponents/search';
import CopyItems from './CopyItems';

const Root = styled.div`
  min-height: 50vh;
`;

const NoteText = styled.div`
  padding: 1.75rem 1rem;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  text-align: center;

  div {
    display: inline-block;
  }
`;

const SearchGrid = styled.div`
  padding: 0 1rem 1rem;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 6rem;
  grid-gap: 1rem;
`;

const RemoveItem = styled.button`
  margin-left: 1rem;
  padding: 0.3rem 0.3rem;
  border: none;
  background-color: transparent;
`;

interface Props<T> {
  selectedList: T[];
  setSelectedList: (items: T[]) => void;
  dataFieldKeys: KeySortPair[];
  note: string;
  searchPlaceholder: string;
  endpoint: string;
  type: CoreItem;
}

function ItemSelector<T>(props: Props<T>) {
  const {
    selectedList, setSelectedList, dataFieldKeys,
    note, searchPlaceholder, endpoint, type,
  } = props;

  const addItemToList = (newItem: {datum: T}) => {
    if (!selectedList.find((item: any) => item.id === (newItem.datum as any).id)) {
      setSelectedList([...selectedList, {...newItem.datum, optional: false}]);
      return true;
    }
  };

  const removeItemFromList = (itemToRemove: T) => {
    const updatedMtnList = selectedList.filter((item: any) => item.id !== (itemToRemove as any).id);
    setSelectedList([...updatedMtnList]);
  };

  const copyItems = (items: T[]) => {
    const newList = [
      ...selectedList.filter((d1: any) => !(items as any).find((d2: any) => d1.id === d2.id)),
      ...items,
    ];
    setSelectedList([...newList]);
  };

  const toggleOptional = (index: number) => {
    const modifiedList = [...selectedList] as any[];
    modifiedList[index].optional = !modifiedList[index].optional;
    setSelectedList([...modifiedList]);
  };

  const selectedItemList = selectedList.map((item: any, i: number) => {
    return {
      ...item,
      id: item.id,
      name: item.name,
      optionalSort: item.optional ? 1 : 0,
      optionalNode: (
        <input
          key={'create-list-optional-item-toggle-' + item.id}
          type='checkbox'
          checked={item.optional}
          onChange={() => toggleOptional(i)}
        />
      ),
      removeNode: (
        <RemoveItem
          key={'create-list-remove-item-' + item.id}
          onClick={() => removeItemFromList(item)}
        >
          ×
        </RemoveItem>),
    };
  });

  const actionFieldKeys = [
    {displayKey: 'optionalNode', sortKey: 'optionalSort', label: 'Optional'},
    {displayKey: 'removeNode', sortKey: null, label: 'Remove'},
  ];

  return (
    <>
      <Root>
        <NoteText>
          <span>
            <IconContainer $color={primaryColor}>
              <BasicIconInText icon={faMap} />
            </IconContainer>
            {note}
          </span>
        </NoteText>
        <SearchGrid>
          <Search
            endpoint={endpoint}
            ignore={selectedList.map((item: any) => item.id)}
            onSelect={addItemToList}
            keepFocusOnSelect={true}
            placeholder={searchPlaceholder}
          />
          <CopyItems
            type={type}
            copyItems={copyItems}
          />
        </SearchGrid>
        <div>
          <ItemTable
            showIndex={true}
            items={selectedItemList}
            dataFieldKeys={dataFieldKeys}
            completionFieldKeys={[]}
            actionFieldKeys={actionFieldKeys}
            type={type}
          />
        </div>
      </Root>
    </>
  );
}

export default React.memo(ItemSelector);
