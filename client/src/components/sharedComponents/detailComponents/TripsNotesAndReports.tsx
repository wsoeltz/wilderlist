import {
  faUserEdit,
  // faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import DetailSegment, {Panel} from './DetailSegment';
import LatestWilderlistReports from './latestWilderlistReports';
import TripsAndNotes from './TripsAndNotes';

const TripsNotesAndReports = () => {
  const panels: Panel[] = [
    {
      title: 'Your notes and ascents',
      reactNode: <TripsAndNotes />,
      customIcon: false,
      icon: faUserEdit,
    },
    {
      title: 'Latest Wilderlist Trip Reports',
      reactNode: <LatestWilderlistReports />,
      renderHiddenContent: true,
      // customIcon: false,
      // icon: faNewspaper,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
    />
  );
};

export default TripsNotesAndReports;
