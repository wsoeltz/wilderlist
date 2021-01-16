import {
  faList,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import DetailSegment, {Panel} from './DetailSegment';
import LatestWilderlistReports from './latestWilderlistReports';
import TripsAndNotes from './TripsAndNotes';

const TripsNotesAndReports = () => {
  const panels: Panel[] = [
    {
      title: 'Your notes and ascents',
      node: <TripsAndNotes />,
      customIcon: false,
      icon: faList,
    },
    {
      title: 'Latest Wilderlist Trip Reports',
      node: <LatestWilderlistReports />,
      renderHiddenContent: true,
      customIcon: false,
      icon: faMapMarkerAlt,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
    />
  );
};

export default TripsNotesAndReports;
