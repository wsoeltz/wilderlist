import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components/macro';
import {CallbackInput} from '../';
import MountainIcon from '../../../../../assets/images/icons/mountain-highlighted.svg';
import TentIcon from '../../../../../assets/images/icons/tent-highlighted.svg';
import TrailIcon from '../../../../../assets/images/icons/trail-highlighted.svg';
import useFluent from '../../../../../hooks/useFluent';
import {
  Routes,
} from '../../../../../routing/routes';
import {
  campsiteDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../../../routing/Utils';
import {
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {Coordinate, TrailType} from '../../../../../types/graphQLTypes';
import {CoreItems} from '../../../../../types/itemTypes';
import LoadingSimple from '../../../../sharedComponents/LoadingSimple';
import ActionButtons from './ActionButtons';
import AddRemoveActions from './AddRemoveActions';
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
  highlightedPointsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
  highlightedTrailsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
  highlightedRoadsGeojson: mapboxgl.GeoJSONSourceOptions['data'] | undefined;
  callback: ((input: CallbackInput) => void) | undefined;
}

const ClickedPopup = (props: Props) => {
  const {
    itemType, location, close,
    highlightedPointsGeojson, highlightedTrailsGeojson, highlightedRoadsGeojson,
    callback,
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
      const trailLength = parseFloat(data.subtitle);
      const trailLengthDisplay = trailLength < 0.1
        ? Math.round(trailLength * 5280) + ' ft'
        : parseFloat(trailLength.toFixed(1)) + ' mi';
      subtitle = !isNaN(trailLength)
        ? trailLengthDisplay + ' long ' + getString('global-formatted-trail-type', {type})
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

    let highlighted: boolean = false;
    if ((itemType === CoreItems.mountains || itemType === CoreItems.campsites) &&
      highlightedPointsGeojson && (highlightedPointsGeojson as any).features) {
      highlighted = Boolean((highlightedPointsGeojson as any).features.find((f: any) =>
        f.properties.id === id));
    } else if (itemType === CoreItems.trails && (type === TrailType.road || type === TrailType.dirtroad) &&
        highlightedRoadsGeojson && (highlightedRoadsGeojson as any).features) {
      highlighted = Boolean((highlightedRoadsGeojson as any).features.find((f: any) =>
        f.properties.id === id));
    } else if (itemType === CoreItems.trails && highlightedTrailsGeojson &&
        (highlightedTrailsGeojson as any).features) {
      highlighted = Boolean((highlightedTrailsGeojson as any).features.find((f: any) =>
        f.properties.id === id));
    }

    const addEditRenderProp = () => (
      <AddRemoveActions
        id={id}
        itemType={itemType}
        highlighted={highlighted}
        callback={callback}
        close={close}
      />
    );

    output = (
      <>
        <PopupTitle
          title={name}
          subtitle={subtitle}
          imgSrc={imgSrc}
          onClick={onClick}
        />
        <Switch>
          <Route exact path={Routes.AddTripReport} component={addEditRenderProp} />
          <Route exact path={Routes.EditTripReport} component={addEditRenderProp} />
          <Route exact path={Routes.CreateList} component={addEditRenderProp} />
          <Route exact path={Routes.EditList} component={addEditRenderProp} />
          <Route exact path={Routes.EditTrailParent} component={addEditRenderProp} />
          <Route render={() => (
              <>
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
                  location={location}
                />
              </>
            )}
          />
        </Switch>
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
