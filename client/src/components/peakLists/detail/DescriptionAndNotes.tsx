import { faAlignLeft, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import sortBy from 'lodash/sortBy';
import React from 'react';
import {
  FORMAT_STATE_REGION_FOR_TEXT,
} from '../../../contextProviders/getFluentLocalizationContext';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {useBasicListDetails} from '../../../queries/lists/useBasicListDetails';
import {usePeakListItems} from '../../../queries/lists/usePeakListItems';
import { ExternalResource } from '../../../types/graphQLTypes';
import {AggregateItem} from '../../../types/itemTypes';
import { isState } from '../../../utilities/dateUtils';
import DetailSegment, {Panel} from '../../sharedComponents/detailComponents/DetailSegment';
import UsersNotes from '../../sharedComponents/detailComponents/usersNotes';
import Description from './Description';
import IntroText from './IntroText';

interface Props {
  peakListId: string;
}

const DescriptionAndNotes = (props: Props) => {
  const {peakListId} = props;
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const getString = useFluent();
  const details = useBasicListDetails(peakListId, userId);
  const items = usePeakListItems(peakListId);

  let name: string;
  let description: string | React.ReactElement<any> | null;
  let resources: ExternalResource[];
  if (details.data && details.data.peakList && items.data && items.data.peakList) {
    const {peakList} = details.data;
    const {mountains} = items.data.peakList;
    name = peakList.name;
    resources = peakList.resources ? peakList.resources : [];
    const stateOrRegionString = peakList.stateOrRegionString;
    if (peakList.description && peakList.description.length) {
      description = peakList.description;
    } else {
      const isStateOrRegion = isState(stateOrRegionString) === true ? 'state' : 'region';
      const mountainsSortedByElevation = sortBy(mountains, ['elevation']).reverse();
      description = (
        <IntroText
          listName={peakList.name}
          numberOfPeaks={peakList.numMountains}
          isStateOrRegion={isStateOrRegion}
          stateRegionName={FORMAT_STATE_REGION_FOR_TEXT(stateOrRegionString)}
          highestMountain={mountainsSortedByElevation[0]}
          smallestMountain={mountainsSortedByElevation[mountainsSortedByElevation.length - 1]}
          type={peakList.type}
          parent={peakList.parent ? {name} : null}
          shortName={peakList.shortName}
        />
      );
    }
  } else {
    name = '';
    description = null;
    resources = [];
  }

  const panels: Panel[] = [
    {
      title: getString('header-text-menu-item-about') + ' ' + name,
      reactNode: (
        <Description
          key={'description-for-' + peakListId}
          loading={details.loading || items.loading}
          description={description}
          resources={resources}
        />
      ),
      renderHiddenContent: true,
      icon: faAlignLeft,
      customIcon: false,
    }, {
      title: getString('user-notes-title'),
      reactNode: (
        <UsersNotes
          id={peakListId}
          name={name}
          type={AggregateItem.list}
          isAlone={true}
        />
      ),
      icon: faUserEdit,
      customIcon: false,
    },
  ];

  return (
    <DetailSegment
      panels={panels}
      panelId={'descriptionAndNotesPanelId'}
    />
  );
};

export default DescriptionAndNotes;
