import React from 'react';
import {
  Feature,
  Layer,
} from 'react-mapbox-gl';
import getTrails, {
  TrailsDatum,
  TrailType,
} from '../../../utilities/getTrails';
import {
  PopupData,
  PopupDataTypes,
  Trail,
} from './types';

export const getTrailsData = async (lat: number, lon: number, setTrailData: (input: Trail[]) => void) => {
  try {
    const res = await getTrails({params: {lat, lon, maxDistance: 25}});
    if (res && res.data && res.data.trails) {
      const rawData: TrailsDatum[] = res.data.trails;
      const cleanedTrailData: Trail[] = rawData.map(trailDatum => {
        return {
          id: trailDatum.id.toString(),
          latitude: trailDatum.latitude,
          longitude: trailDatum.longitude,
          name: trailDatum.name,
          elevation: trailDatum.ascent,
          url: trailDatum.url,
          mileage: trailDatum.length,
          type: trailDatum.type,
          summary: trailDatum.summary,
          difficulty: trailDatum.difficulty,
          location: trailDatum.location,
          image: trailDatum.imgMedium,
          conditionStatus: trailDatum.conditionStatus,
          conditionDetails: trailDatum.conditionDetails,
          conditionDate: new Date(trailDatum.conditionDate),
          highPoint: trailDatum.high,
          lowPoint: trailDatum.low,
        };
      });
      setTrailData([...cleanedTrailData]);
    } else {
      console.error('There was an error getting the location response');
    }
  } catch (err) {
    console.error(err);
  }
};

interface Props {
  showNearbyTrails: boolean | undefined;
  trailData: Trail[] | undefined;
  setTrailData: (value: Trail[] | undefined) => void;
  setPopupInfo: (value: PopupData | null) => void;
  majorTrailsOn: boolean;
  togglePointer: (mapEl: any, cursor: string) => void;
}

const TrailsLayer = (props: Props) => {
  const {
    showNearbyTrails, trailData, setTrailData, setPopupInfo,
    majorTrailsOn, togglePointer,
  } = props;

  const trails: Array<React.ReactElement<any>> = [];

  if (showNearbyTrails && trailData !== undefined) {
    trailData.forEach(point => {
      const onClick = () => {
        setPopupInfo({type: PopupDataTypes.Trail, data: {...point}});
        if (showNearbyTrails === true) {
          getTrailsData(point.latitude, point.longitude, setTrailData);
        }
      };
      if (point.type !== TrailType.Connector && majorTrailsOn) {
        const iconImage = 'trail-default';
        trails.push(
          <Feature
            coordinates={[point.longitude, point.latitude]}
            onClick={onClick}
            onMouseEnter={(event: any) => togglePointer(event.map, 'pointer')}
            onMouseLeave={(event: any) => togglePointer(event.map, '')}
            properties={{
              'icon-image': iconImage,
            }}
            key={point.id + point.latitude + point.longitude}
          />,
        );
      }
    });
  }

  const trailLayer = trails && trails.length ? (
    <Layer
      type='symbol'
      id='trail-signs'
      layout={{
        'icon-image': ['get', 'icon-image'],
        'icon-size': {
          base: 0.5,
          stops: [
            [1, 0.2],
            [10, 0.45],
            [17, 0.75],
            [20, 1],
          ],
        },
      }}
    >
      {trails}
    </Layer>
  ) : <></>;

  return trailLayer;
};

export default TrailsLayer;
