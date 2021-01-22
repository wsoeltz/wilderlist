import {
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import DetailSegment, {Panel} from './DetailSegment';
import LatestWilderlistReports from './latestWilderlistReports';
import TripsAndNotes, {Props} from './TripsAndNotes';
import useFluent from '../../../hooks/useFluent';

const TripsNotesAndReports = (props: Props) => {
  const {id, name, item} = props;
  const getString = useFluent();
  const panels: Panel[] = [
    {
      title: getString('global-text-value-item-notes-and-dates', {type: item}),
      reactNode: <TripsAndNotes id={id} name={name} item={item} />,
      customIcon: false,
      icon: faUserEdit,
    },
    {
      title: getString('trip-report-latest-title'),
      reactNode: <LatestWilderlistReports id={id} name={name} type={item} />,
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
