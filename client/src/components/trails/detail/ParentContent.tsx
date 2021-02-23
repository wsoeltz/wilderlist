import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useBasicTrailDetail} from '../../../queries/trails/useBasicTrailDetail';
import {CoreItem} from '../../../types/itemTypes';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import UsersNotes from '../../sharedComponents/detailComponents/usersNotes';
import {trailDefaultSvg} from '../../sharedComponents/svgIcons';
import TrailTable from './TrailTable';

interface Props {
  id: string;
}

const Content = (props: Props) => {
  const  {id} = props;
  const {data} = useBasicTrailDetail(id);
  const getString = useFluent();

  const panelCounts: Array<{index: number, count: number, numerator?: number}> | undefined = data && data.trail
    ? [{index: 0, count: data.trail.childrenCount}] : undefined;
  const panels: Panel[] = [
    {
      title: getString('global-text-value-trail-segments'),
      reactNode: (
        <TrailTable
          id={id}
        />
      ),
      customIcon: true,
      icon: trailDefaultSvg,
    }, {
      title: getString('user-notes-title'),
      reactNode: (
        <UsersNotes
          id={id}
          name={data && data.trail && data.trail.name ? data.trail.name : ''}
          type={CoreItem.trail}
          isAlone={true}
        />
      ),
      icon: faUserEdit,
      customIcon: false,
    },
  ];

  return (
    <DetailSegment
      key={'parentTrailDetailPanel' + id}
      panels={panels}
      panelCounts={panelCounts}
      panelId={'parentTrailDetailPanel'}
    />
  );
};

export default Content;
