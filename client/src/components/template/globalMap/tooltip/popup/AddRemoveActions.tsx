import {
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {CallbackInput} from '../';
import {
  BasicIconInText,
  ButtonPrimary,
  ButtonSecondary,
} from '../../../../../styling/styleUtils';
import {CoreItems, coreItemsToCoreItem} from '../../../../../types/itemTypes';
import LoadingSimple from '../../../../sharedComponents/LoadingSimple';

const AddButton = styled(ButtonPrimary)`
  width: 100%;
  border-radius: 0;
`;

const RemoveButton = styled(ButtonSecondary)`
  width: 100%;
  border-radius: 0;
`;

const cacheItem: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getItem = axios.create({
  adapter: cacheItem.adapter,
});

interface Props {
  highlighted: boolean;
  itemType: CoreItems;
  id: string;
  callback: ((input: CallbackInput) => void) | undefined;
  close: () => void;
}

const AddRemoveActions = ({id, highlighted, itemType, callback, close}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = () => {
    setLoading(true);
    getItem({
        method: 'post',
        url: '/api/get-item',
        data: {id, itemType},
      }).then((res) => {
        if (callback && res && res.data) {
          callback({
            highlighted,
            item: itemType,
            datum: {...res.data, id: res.data._id},
          });
        }
        close();
      }).catch(error => {
        console.error(error);
        close();
      });
  };

  let output: React.ReactElement<any> | null;
  if (loading) {
    const Root = highlighted ? RemoveButton : AddButton;
    output = (
      <Root disabled={true}><LoadingSimple size={12} /></Root>
    );
  } else if (highlighted) {
    output = (
      <RemoveButton>
        <BasicIconInText icon={faTimes} />
        Remove {coreItemsToCoreItem(itemType)}
      </RemoveButton>
    );
  } else {
    output = (
      <AddButton>
        <BasicIconInText icon={faPlus} />
        Add {coreItemsToCoreItem(itemType)}
      </AddButton>
    );
  }

  return (
    <div onClick={onClick}>
      {output}
    </div>
  );
};

export default AddRemoveActions;
