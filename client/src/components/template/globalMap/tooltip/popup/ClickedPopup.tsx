import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import MountainIcon from '../../../../../assets/images/icons/mountain-highlighted.svg';
import TentIcon from '../../../../../assets/images/icons/tent-highlighted.svg';
import TrailIcon from '../../../../../assets/images/icons/trail-highlighted.svg';
import useFluent from '../../../../../hooks/useFluent';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../../../routing/Utils';
import {
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {Coordinate} from '../../../../../types/graphQLTypes';
import {CoreItems} from '../../../../../types/itemTypes';
import LoadingSimple from '../../../../sharedComponents/LoadingSimple';
import ActionButtons from './ActionButtons';
import DrivingDirections from './directions';
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
  itemType: CoreItems;
  close: () => void;
}

const ClickedPopup = (props: Props) => {
  const {
    itemType, location, close,
  } = props;

  const {loading, error, data} = usePopupData(itemType, props.id, location, props.name);
  const getString = useFluent();
  const {push} = useHistory();

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
      if (itemType === CoreItems.mountains) {
        push(mountainDetailLink(id));
      } else if (itemType === CoreItems.campsites) {
        push(campsiteDetailLink(id));
      } else if (itemType === CoreItems.trails) {
        push(trailDetailLink(id));
      }
      close();
    };
    let name: string;
    let subtitle: string;
    let imgSrc: string;
    if (itemType === CoreItems.mountains) {
      name = data.name ? data.name : 'Unnamed Peak';
      subtitle = data.subtitle ? data.subtitle : '';
      imgSrc = MountainIcon;
    } else if (itemType === CoreItems.trails) {
      name = data.name ? data.name : upperFirst(getString('global-formatted-trail-type', {type}));
      subtitle = data.subtitle
        ? data.subtitle + ' long ' + getString('global-formatted-trail-type', {type})
        : getString('global-formatted-trail-type', {type});
      if (data.parents && data.parents.length && data.subtitle) {
        subtitle += ' segment';
      }
      imgSrc = TrailIcon;
    } else if (itemType === CoreItems.campsites) {
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
            itemType={itemType}
            destination={location}
          />
          <LastTrip
            id={id}
            itemType={itemType}
            close={close}
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
