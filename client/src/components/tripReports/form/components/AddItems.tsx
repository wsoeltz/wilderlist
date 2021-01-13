import React from 'react';
import useFluent from '../../../../hooks/useFluent';
import { Mountain, State } from '../../../../types/graphQLTypes';
import {mountainNeutralSvg} from '../../../sharedComponents/svgIcons';
import ItemSelector from './ItemSelector';

export interface MountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
  state: null | {
    id: State['id'];
    abbreviation: State['abbreviation'];
  };
  elevation: Mountain['elevation'];
  location: Mountain['location'];
}

interface Props {
  selectedMountains: MountainDatum[];
  setSelectedMountains: (mountains: MountainDatum[]) => void;
}

const AddItems = (props: Props) => {
  const {
    selectedMountains, setSelectedMountains,
  } = props;

  const getString = useFluent();
  const getMountainSubtitle = (mtn: MountainDatum) =>
    mtn.elevation + 'ft' + (mtn.state && mtn.state.abbreviation ? ', ' + mtn.state.abbreviation : '');

  return (
    <ItemSelector
      selectedList={selectedMountains}
      setSelectedList={setSelectedMountains}
      getSubtitleFromDatum={getMountainSubtitle}
      icon={mountainNeutralSvg}
      title={getString('global-text-value-mountains')}
      note={getString('trip-report-add-additional-mtns-desc')}
      searchPlaceholder={getString('global-text-value-search-mountains')}
    />
  );

};

export default AddItems;
