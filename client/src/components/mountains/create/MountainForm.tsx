import React, {useState} from 'react';
import {
  ButtonPrimary,
  ButtonSecondary,
  InputBase,
  Label,
} from '../../../styling/styleUtils';
import styled from 'styled-components';
import Map, {CoordinateWithDates} from '../../sharedComponents/map';
import { PeakListVariants } from '../../../types/graphQLTypes';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const FullColumn = styled.div`
  grid-column: span 2;
`;

const longLatMin = -90;
const longLatMax = 90;
const elevationMin = 0;
const elevationMax = 29029; // Height of Everest

const validateIntValue = (value: string, min: number, max: number) => {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return 0;
  } else if (parsedValue > max || parsedValue < min) {
    return 0;
  } else {
    return parsedValue;
  }
}

const MountainForm = () => {

  const [name, setName] = useState<string>('');

  const [stringLat, setStringLat] = useState<string>('');
  const [stringLong, setStringLong] = useState<string>('');

  const [stringElevation, setStringElevation] = useState<string>('');

  const latitude: number = validateIntValue(stringLat, longLatMin, longLatMax);
  const longitude: number = validateIntValue(stringLong, longLatMin, longLatMax);
  const elevation: number = validateIntValue(stringElevation, elevationMin, elevationMax);

  const coordinate: CoordinateWithDates = {
    id: '',
    latitude, longitude,
    name, elevation,
    completionDates: null,
  }

  const map = !isNaN(latitude) && !isNaN(longitude) && !isNaN(elevation)
    && latitude <= 90 && latitude >= - 90 && longitude <= 90 && longitude >= - 90
    ? (
        <Map
          id={''}
          coordinates={[coordinate]}
          highlighted={[coordinate]}
          peakListType={PeakListVariants.standard}
          userId={null}
          isOtherUser={undefined}
          hideLegend={true}
          key={'create-mountain-key'}
        />
      ) : null;

  return (
    <Root>
      <FullColumn>
        <Label>
          Mountain Name
        </Label>
        <InputBase
          type={'text'}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </FullColumn>
      <div>
        <Label>
          Latitude
        </Label>
        <InputBase
          type={'number'}
          max={longLatMax}
          min={longLatMin}
          value={stringLat}
          onChange={e => setStringLat(e.target.value)}
        />
      </div>
      <div>
        <Label>
          Longitude
        </Label>
        <InputBase
          type={'number'}
          max={longLatMax}
          min={longLatMin}
          value={stringLong}
          onChange={e => setStringLong(e.target.value)}
        />
      </div>
      <FullColumn>
        {map}
      </FullColumn>
      <div>
        <Label>
          State
        </Label>
        <InputBase />
      </div>
      <div>
        <Label>
          Elevation
        </Label>
        <InputBase
          type={'number'}
          min={elevationMin}
          max={elevationMax}
          value={stringElevation}
          onChange={e => setStringElevation(e.target.value)}
        />
      </div>


      <FullColumn>
        <ButtonSecondary>
          Cancel
        </ButtonSecondary>
        <ButtonPrimary>
          Submit
        </ButtonPrimary>
      </FullColumn>
    </Root>
  );
}

export default MountainForm;