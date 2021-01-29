import React, {useEffect} from 'react';
import useFluent from '../../../hooks/useFluent';
import {usePeakListItems} from '../../../queries/lists/usePeakListItems';
import {PlaceholderText} from '../../../styling/styleUtils';
import {CoreItem, coreItemToCoreItems} from '../../../types/itemTypes';
import ItemTable from '../../sharedComponents/detailComponents/itemTable/ItemTable';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';

interface Props {
  peakListId: string;
  field: CoreItem;
  setItems: (value: any[]) => void;
}

const CopyItemsList = (props: Props) => {
  const {peakListId, field, setItems} = props;

  const getString = useFluent();
  const {loading, error, data} = usePeakListItems(peakListId);

  useEffect(() => {
    if (data && data.peakList) {
      setItems(data.peakList[coreItemToCoreItems(field)]);
    }
  }, [data, setItems, field]);

  if (loading) {
    return <LoadingSpinner />;
  } else if (error) {
    return <PlaceholderText>{getString('global-error-retrieving-data')}</PlaceholderText>;
  } else if (data) {
    const items = (data.peakList[coreItemToCoreItems(field)] as any).filter((item: any) => item);
    if (items.length) {
      return (
        <ItemTable
          showIndex={true}
          items={items}
          dataFieldKeys={[]}
          completionFieldKeys={[]}
          actionFieldKeys={[]}
          type={field}
        />
      );
    } else {
      return (
        <PlaceholderText>
          {getString('global-text-value-no-items-found', {type: coreItemToCoreItems(field)})}
        </PlaceholderText>
      );
    }
  } else {
    return null;
  }
};

export default CopyItemsList;
