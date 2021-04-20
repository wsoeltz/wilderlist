import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  Basket,
  BasketTitle,
  IconContainer,
  lightBaseColor,
  SmallTextNote,
} from '../../../../styling/styleUtils';
import Search from '../../../sharedComponents/search';
import {
  SelectedDetailsBox,
} from '../Utils';
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

  const getString = useFluent();

  const addItemToList = (newItem: {datum: T}) => {
    if (!selectedList.find((item: any) => item.id === (newItem.datum as any).id)) {
      setSelectedList([...selectedList, newItem.datum]);
      return true;
    }
  };

  const removeItemFromList = (itemToRemove: T) => {
    const updatedMtnList = selectedList.filter((item: any) => item.id !== (itemToRemove as any).id);
    setSelectedList([...updatedMtnList]);
  };

  const selectedItemList = selectedList.map((item: any) => {
    let name = item.name;
    if (!name && item.type !== undefined) {
      name = upperFirst(getString('global-formatted-anything-type', {type: item.type}));
    }
    return (
      <SelectedItem
        key={item.id}
        name={name}
        subtitle={getSubtitleFromDatum(item)}
        onClose={() => removeItemFromList(item)}
      />
    );
  });

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
        <SelectedDetailsBox>
          {selectedItemList}
        </SelectedDetailsBox>
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

export default ItemSelector;
