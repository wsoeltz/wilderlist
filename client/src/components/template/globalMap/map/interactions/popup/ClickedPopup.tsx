import { GetString } from 'fluent-react/compat';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../../../../routing/Utils';
import {Coordinate} from '../../../../../../types/graphQLTypes';
import LoadingSimple from '../../../../../sharedComponents/LoadingSimple';
import {ItemType} from '../../interactions';
import DrivingDirections from './DrivingDirections';
import LastTrip from './LastTrip';
import PopupTitle from './PopupTitle';
import usePopupData from './usePopupData';

interface Props {
  name: string | null;
  location: Coordinate;
  id: string | null;
  push: (url: string) => void;
  itemType: ItemType;
  getString: GetString;
}

const ClickedPopup = (props: Props) => {
  const {
    push, itemType, location, getString,
  } = props;

  const {loading, error, data} = usePopupData(itemType, props.id, location, props.name);

  let output: React.ReactElement<any> | null;
  if (loading) {
    output = <LoadingSimple />;
  } else if (error) {
    output = <div>{getString('global-error-retrieving-data')}</div>;
  } else if (data !== undefined) {
    const {id, type} = data;
    const onClick = () => {
      if (itemType === ItemType.mountain) {
        push(mountainDetailLink(id));
      } else if (itemType === ItemType.campsite) {
        push(campsiteDetailLink(id));
      } else if (itemType === ItemType.trail) {
        push(trailDetailLink(id));
      }
    };
    let name: string;
    let subtitle: string;
    if (itemType === ItemType.mountain) {
      name = data.name ? data.name : 'Unnamed Peak';
      subtitle = data.subtitle ? data.subtitle : '';
    } else if (itemType === ItemType.trail) {
      name = data.name ? data.name : upperFirst(getString('global-formatted-trail-type', {type}));
      subtitle = data.subtitle ? data.subtitle : '';
    } else if (itemType === ItemType.campsite) {
      name = data.name ? data.name : upperFirst(getString('global-formatted-campsite-type', {type}));
      subtitle = upperFirst(getString('global-formatted-campsite-type', {type}));
    } else {
      name = data.name ? data.name : 'Point';
      subtitle = '';
    }

    output = (
      <>
        <PopupTitle
          title={name}
          subtitle={subtitle}
          onClick={onClick}
        />
        <div className={'popup-main-content'}>
          <DrivingDirections
            getString={getString}
            destination={location}
          />
          <LastTrip
            id={id}
            itemType={itemType}
            getString={getString}
          />
        </div>
      </>
    );
  } else {
    output = null;
  }

  return (
    <>
      {output}
    </>
  );

};

export default ClickedPopup;
