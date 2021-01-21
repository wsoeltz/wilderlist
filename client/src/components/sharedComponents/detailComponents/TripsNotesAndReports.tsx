import {
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import DetailSegment, {Panel} from './DetailSegment';
import LatestWilderlistReports from './latestWilderlistReports';
import TripsAndNotes, {Props} from './TripsAndNotes';

const TripsNotesAndReports = (props: Props) => {
  const {id, name, item} = props;
  const panels: Panel[] = [
    {
      title: 'Your notes and ascents',
      reactNode: <TripsAndNotes id={id} name={name} item={item} />,
      customIcon: false,
      icon: faUserEdit,
    },
    {
      title: 'Latest Wilderlist Trip Reports',
      reactNode: <LatestWilderlistReports id={id} name={name} />,
      renderHiddenContent: true,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
    />
  );
};

export default TripsNotesAndReports;
