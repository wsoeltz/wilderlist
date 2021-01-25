import React from 'react';
import styled from 'styled-components/macro';
import {
  Basket,
  BasketTitle,
  IconContainer,
  lightBaseColor,
  SmallTextNote,
} from '../../../styling/styleUtils';
import Search from '../../sharedComponents/search';
import SelectedItem from './SelectedItem';

const Title = styled(BasketTitle)`
  padding-bottom: 0;
`;

interface Props<T> {
  selectedList: T[];
  setSelectedList: (items: T[]) => void;
  getSubtitleFromDatum: (datum: T) => string;
  icon: string;
  title: string;
  note: string;
  searchPlaceholder: string;
  endpoint: string;
}

function ItemSelector<T>(props: Props<T>) {
  const {
    selectedList, setSelectedList, getSubtitleFromDatum,
    icon, title, note, searchPlaceholder, endpoint,
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

  const toggleOptional = (index: number) => {
    const modifiedList = [...selectedList] as any[];
    modifiedList[index].optional = !modifiedList[index].optional;
    setSelectedList([...modifiedList]);
  };

  const selectedItemList = selectedList.map((item: any, i: number) => (
    <SelectedItem
      key={item.id}
      id={item.id}
      name={item.name}
      subtitle={getSubtitleFromDatum(item)}
      onClose={() => removeItemFromList(item)}
      isOptional={item.optional}
      toggleOptional={() => toggleOptional(i)}
    />
  ));

  const texNote = selectedList.length ? null : (
    <SmallTextNote>
      {note}
    </SmallTextNote>
  );

  return (
    <>
      <Basket>
        <Title>
          <IconContainer $color={lightBaseColor} dangerouslySetInnerHTML={{__html: icon}} />
          {title}
        </Title>
        {texNote}
        <div>
          {selectedItemList}
        </div>
        <Search
          endpoint={endpoint}
          ignore={selectedList.map((item: any) => item.id)}
          onSelect={addItemToList}
          keepFocusOnSelect={true}
          compact={true}
          placeholder={searchPlaceholder}
        />
      </Basket>
    </>
  );
}

export default React.memo(ItemSelector);
