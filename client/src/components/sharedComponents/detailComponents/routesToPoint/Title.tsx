import partition from 'lodash/partition';
import uniqBy from 'lodash/uniqBy';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import {Link} from 'react-router-dom';
import useFluent from '../../../../hooks/useFluent';
import {RoutesToPointInput} from '../../../../routing/services';
import {campsiteDetailLink, mountainDetailLink} from '../../../../routing/Utils';
import {CampsiteType, ParkingType, TrailType} from '../../../../types/graphQLTypes';
import {CoreItem} from '../../../../types/itemTypes';

interface Props {
  item: CoreItem;
  trails: Array<{
    id: string,
    type?: CampsiteType | TrailType | ParkingType | string | null;
    name?: string | null;
  }>;
  destinationType: RoutesToPointInput['destination'];
  destination: {
    _id: string,
    type?: CampsiteType | TrailType | ParkingType | string | null;
    name?: string | null;
  };
}

const Title = (props: Props) => {
  const {trails, destinationType, destination} = props;
  const getString = useFluent();
  let title: string | React.ReactElement<any>;
  let optionalSubtitle: React.ReactElement<any> | null = null;
  let url = '#';
  if (!destinationType || destinationType === 'parking') {
    if (trails && trails.length) {
      const uniqueTrails = uniqBy(trails.filter(t => t.name), 'name');
      const [justTrails, justRoads] =
        partition(uniqueTrails, t => t.type && t.type !== TrailType.road && t.type !== TrailType.dirtroad);
      const topTrailsString = justTrails.length
        ? justTrails.slice(0, 2).map(t => t.name).join(', ___')
        : justRoads.slice(0, 2).map(t => t.name).join(', ___');
      if (topTrailsString.length) {
        const nameComponents = topTrailsString.split('___').map((t, ii) => (
          <React.Fragment key={'trail-name' + destination._id + t + ii}>
            {t}
            <wbr />
          </React.Fragment>
        ));
        const remaining = uniqueTrails.length - nameComponents.length;
        if (remaining) {
          nameComponents.push((
            <React.Fragment key={'trail-name-others' + destination._id + remaining}>
              <wbr />&nbsp;&amp; {remaining} {getString('global-text-value-others', {count: remaining})}
            </React.Fragment>
          ));
        }
        title = <>{nameComponents}</>;
      } else {
        title = trails.length + ' trails';
      }
    } else if (destination.name) {
      title = destination.name;
    } else if (destination.type) {
      title = destination.type.split('_').join(' ');
    } else {
      title = trails.length + ' trails';
    }
    title = <><em>via</em>  {title}</>;
  } else {
    const formattedType = upperFirst(getString('global-formatted-anything-type', {type: destination.type}));
    optionalSubtitle = (
      <div>
        <small>{formattedType}</small>
      </div>
    );
    if (destination.name) {
      title = destination.name;
    } else {
      title = formattedType;
    }
    if (destinationType === 'campsites') {
      url = campsiteDetailLink(destination._id);
    }
    if (destinationType === 'mountains') {
      url = mountainDetailLink(destination._id);
      optionalSubtitle = (
        <div>
          <small>{(destination as any).elevation}ft</small>
        </div>
      );
    }
  }
  return (
    <>
      <Link to={url}>{title}</Link>
      {optionalSubtitle}
    </>
  );
};

export default Title;
