import React from 'react';
import FromIconImgSrc from '../../../../assets/images/icons/from-icon.svg';
import useDirectionsOrigin from '../../../../hooks/directions/useDirectionsOrigin';
import useFluent from '../../../../hooks/useFluent';
import {
  BlockHeader,
  BlockTitle,
  CenteredHeader,
  DarkBlock,
  Details,
  EmptyBlock,
  HorizontalScrollContainer,
} from '../../../../styling/sharedContentStyles';
import {
  LinkButtonCompact,
} from '../../../../styling/styleUtils';
import {Coordinate} from '../../../../types/graphQLTypes';
import LoadingSimple from '../../LoadingSimple';
import Destinations from './Destinations';
import SetOrigin from './SetOrigin';

interface Props {
  destination: Coordinate;
}

const PanelDirections = (props: Props) => {
  const {destination} = props;
  const {location, updateLocation, getUsersLocation} = useDirectionsOrigin();
  const clearLocation = () => updateLocation(null);
  const getString = useFluent();
  let output: React.ReactElement<any> | null;
  if (location.loading) {
    output = (
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        <EmptyBlock>
          <CenteredHeader>
            <LoadingSimple />
          </CenteredHeader>
        </EmptyBlock>
      </HorizontalScrollContainer>
    );
  } else if (location.data) {
    const subtitle = location.data.locationName ? (
      <div>
        <small>{location.data.locationName}</small>
      </div>
    ) : null;
    output = (
      <HorizontalScrollContainer hideScrollbars={false}>
          <DarkBlock>
            <BlockHeader>
              <BlockTitle>{getString('global-text-value-from')}</BlockTitle>
              {location.data.name}
              {subtitle}
            </BlockHeader>
            <Details>
              <LinkButtonCompact onClick={clearLocation}>
                {getString('global-text-value-change')}
              </LinkButtonCompact>
            </Details>
            <Details>
              <img src={FromIconImgSrc} />
            </Details>
          </DarkBlock>
          <Destinations
            start={location.data.coordinates}
            end={destination}
          />
      </HorizontalScrollContainer>
    );
  } else {
    output = (
      <SetOrigin
        error={location.error}
        updateLocation={updateLocation}
        getUsersLocation={getUsersLocation}
      />
    );
  }
  return (
    <>
      {output}
    </>
  );
};

export default PanelDirections;
