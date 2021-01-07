import { GetString } from 'fluent-react/compat';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import styled from 'styled-components/macro';
import MountainIcon from '../../../../../../assets/images/icons/mountain-highlighted.svg';
import TentIcon from '../../../../../../assets/images/icons/tent-highlighted.svg';
import TrailIcon from '../../../../../../assets/images/icons/trail-highlighted.svg';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../../../../routing/Utils';
import {
  tertiaryColor,
} from '../../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../../types/graphQLTypes';
import LoadingSimple from '../../../../../sharedComponents/LoadingSimple';
import {ItemType} from '../../interactions';
import ActionButtons from './ActionButtons';
import DrivingDirections from './DrivingDirections';
import LastTrip from './LastTrip';
import PopupTitle from './PopupTitle';
import usePopupData from './usePopupData';

const Content = styled.div`
  padding: 0.4rem 0.6rem;
`;

const LoadingContainer = styled.div`
  background-color: ${tertiaryColor};
  padding: 2rem;
`;

interface Props {
  name: string | null;
  location: Coordinate;
  id: string | null;
  push: (url: string) => void;
  itemType: ItemType;
  getString: GetString;
  close: () => void;
}

const ClickedPopup = (props: Props) => {
  const {
    push, itemType, location, getString, close,
  } = props;

  const {loading, error, data} = usePopupData(itemType, props.id, location, props.name);

  let output: React.ReactElement<any> | null;
  if (loading) {
    output = (
      <LoadingContainer>
        <LoadingSimple />
      </LoadingContainer>
    );
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
      close();
    };
    let name: string;
    let subtitle: string;
    let imgSrc: string;
    if (itemType === ItemType.mountain) {
      name = data.name ? data.name : 'Unnamed Peak';
      subtitle = data.subtitle ? data.subtitle : '';
      imgSrc = MountainIcon;
    } else if (itemType === ItemType.trail) {
      name = data.name ? data.name : upperFirst(getString('global-formatted-trail-type', {type}));
      subtitle = data.subtitle
        ? data.subtitle + ' long ' + getString('global-formatted-trail-type', {type})
        : getString('global-formatted-trail-type', {type});
      if (data.parents && data.parents.length && data.subtitle) {
        subtitle += ' segment';
      }
      imgSrc = TrailIcon;
    } else if (itemType === ItemType.campsite) {
      name = data.name ? data.name : upperFirst(getString('global-formatted-campsite-type', {type}));
      subtitle = upperFirst(getString('global-formatted-campsite-type', {type}));
      imgSrc = TentIcon;
    } else {
      name = data.name ? data.name : 'Point';
      subtitle = '';
      imgSrc = MountainIcon;
    }

    output = (
      <>
        <PopupTitle
          title={name}
          subtitle={subtitle}
          imgSrc={imgSrc}
          onClick={onClick}
        />
        <Content>
          <DrivingDirections
            getString={getString}
            destination={location}
          />
          <LastTrip
            id={id}
            itemType={itemType}
            getString={getString}
          />
        </Content>
        <ActionButtons
          detailAction={onClick}
          getString={getString}
        />
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
