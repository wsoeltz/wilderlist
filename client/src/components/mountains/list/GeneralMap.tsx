import React, {useContext} from 'react';
import {UserContext} from '../../App';
import {
  FullColumn,
} from '../../sharedComponents/formUtils';
import Map from '../../sharedComponents/map';
import {CoordinateWithDates} from '../../sharedComponents/map/types';

const localstorageShowMajorTrailsGeneralMapKey = 'localstorageShowMajorTrailsGeneralMapKey';
const localstorageShowCampsitesGeneralMapKey = 'localstorageShowCampsitesGeneralMapKey';
const localstorageShowYourLocationGeneralMapKey = 'localstorageShowYourLocationGeneralMapKey';
const localstorageShowOtherMountainsGeneralMapKey = 'localstorageShowOtherMountainsGeneralMapKey';

interface Props {
  visible: boolean;
  getMapCenter: (coords: {latitude: number, longitude: number}) => void;
  highlighted: CoordinateWithDates[] | undefined;
}

const GeneralMap = (props: Props) => {
  const {
    getMapCenter, visible, highlighted,
  } = props;

  const localstorageMajorTrailsVal = localStorage.getItem(localstorageShowMajorTrailsGeneralMapKey);
  const localstorageCampsitesVal = localStorage.getItem(localstorageShowCampsitesGeneralMapKey);
  const localstorageYourLocationVal = localStorage.getItem(localstorageShowYourLocationGeneralMapKey);
  const localstorageOtherMountainsVal = localStorage.getItem(localstorageShowOtherMountainsGeneralMapKey);
  const defaultMajorTrails = (
    localstorageMajorTrailsVal === 'true' || localstorageMajorTrailsVal === null
  ) ? true : false;
  const defaultCampsites = (
    localstorageCampsitesVal === 'true' || localstorageCampsitesVal === null
  ) ? true : false;
  const defaultYourLocation = localstorageYourLocationVal === 'true' ? true : false;
  const defaultOtherMountainsOn = (
    localstorageOtherMountainsVal === 'true' || localstorageOtherMountainsVal === null
  ) ? true : false;

  const me = useContext(UserContext);

  return (
    <FullColumn style={{height: '100%'}}>
      <Map
        mountainId={null}
        peakListId={null}
        userId={me && me._id ? me._id : null}
        isOtherUser={false}
        completedAscents={[]}
        coordinates={[]}
        highlighted={highlighted}
        colorScaleColors={[]}
        colorScaleSymbols={[]}
        showNearbyTrails={true}
        showYourLocation={true}
        showOtherMountains={true}
        showCampsites={true}
        defaultLocationOn={defaultYourLocation}
        defaultMajorTrailsOn={defaultMajorTrails}
        defaultCampsitesOn={defaultCampsites}
        defaultOtherMountainsOn={defaultOtherMountainsOn}
        fillSpace={true}
        toggleVisibility={visible}
        centerCoordsCallback={getMapCenter}
        useGenericFunctionality={true}
      />
    </FullColumn>
  );
};

export default GeneralMap;
