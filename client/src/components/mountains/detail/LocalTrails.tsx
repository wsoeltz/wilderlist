import { GetString } from 'fluent-react';
import sortBy from 'lodash/sortBy';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import HikingProjectSvgLogo from '../../../assets/images/hiking-project-logo.svg';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { AllTrailsLink, generateHikingProjectLink } from '../../../routing/externalLinks';
import { SemiBold } from '../../../styling/styleUtils';
import getTrails from '../../../utilities/getTrails';
import { getDistanceFromLatLonInMiles } from '../../../Utils';
import { genericWords } from '../../peakLists/import';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {
  BasicListItem,
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';

const HikingProjectContainer = styled.div`
  font-size: 0.6rem;
  display: inline-flex;
  align-items: center;
  position: relative;
  top: -5px;
  margin-left: 0.3rem;
`;

const HikingProjectLogo = styled.a`
  margin-left: 0.3rem;
  width: 100px;

  img {
    width: 100%;
  }
`;

interface LatLong {
  latitude: number;
  longitude: number;
}

interface TrailsDatum {
  id: number;
  name: string;
  type: 'Trail' | 'Connector' | 'Featured Hike';
  summary: string;
  difficulty: string;
  stars: number;
  starVotes: number;
  location: string;
  url: string;
  imgSqSmall: string;
  imgSmall: string;
  imgSmallMed: string;
  imgMedium: string;
  length: number;
  ascent: number;
  descent: number;
  high: number;
  low: number;
  longitude: number;
  latitude: number;
  conditionStatus: string;
  conditionDetails: string;
  conditionDate: string;
}

interface Props extends LatLong {
  mountainName: string;
  state: string | null;
}

const LocalTrails = ({mountainName, latitude, longitude, state}: Props) => {
  const [trails, setTrails] = useState<TrailsDatum[] | null>(null);
  const [error, setError] = useState<any | null>(null);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  useEffect(() => {
    const getTrailsData = async () => {
      try {
        const res = await getTrails({params: {lat: latitude, lon: longitude}});
        if (res && res.data && res.data.trails) {
          setTrails(res.data.trails);
        } else {
          setError('There was an error getting the location response');
        }
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    getTrailsData();
  }, [setTrails, latitude, longitude]);

  let output: React.ReactElement<any> | null;
  if (error !== null) {
    output = <BasicListItem>{getFluentString('local-trails-hiking-project-network-error')}</BasicListItem>;
  } else if (trails === null) {
    output = <LoadingSpinner />;
  } else if (trails.length === 0) {
    output = (
      <BasicListItem>
        {getFluentString('local-trails-hiking-project-no-trails', {'mountain-name': mountainName})}
      </BasicListItem>);
  } else if (trails) {
    const mtnNameSafe = mountainName.toLowerCase().trim().split(/\W+/).filter(w => !genericWords.includes(w));
    const filteredTrails: TrailsDatum[] = [];
    trails.forEach(trail => {
      const distance = getDistanceFromLatLonInMiles({
        lat1: latitude, lon1: longitude, lat2: trail.latitude, lon2: trail.longitude,
      });
      if (
        trail.type !== 'Connector' && distance <= 5 && (
          (mtnNameSafe.some(function(v) { return v.length > 1 && trail.name.toLowerCase().indexOf(v) >= 0; }) ||
            mtnNameSafe.some(function(v) { return v.length > 1 && trail.summary.toLowerCase().indexOf(v) >= 0; }))
          || filteredTrails.length < 5
          )
          ) {
        filteredTrails.push(trail);
      }
    });
    const sortedTrails = sortBy(filteredTrails, ['length', 'ascent']).reverse();
    const trailElements: Array<React.ReactElement<any>> = sortedTrails.map(trail => {
      return (
        <BasicListItem key={trail.id}>
          <a href={trail.url} target='_blank' rel='noopener noreferrer'><SemiBold>{trail.name}</SemiBold></a>
          {' - '}
          {getFluentString('local-trails-hiking-project-feet-elevation', {
            miles: trail.length,
            elevation: trail.ascent.toString(),
          })}
        </BasicListItem>
      );
    });
    if (trailElements.length === 0) {
      output = (
        <BasicListItem>
          {getFluentString('local-trails-hiking-project-no-trails', {'mountain-name': mountainName})}
        </BasicListItem>);
    } else {
      output = (
        <>
          {trailElements}
        </>
      );
    }
  } else {
    output = null;
  }

  return (
    <>
      <VerticalContentItem>
        <ItemTitle>
          Nearby Trails
        </ItemTitle>
        <BasicListItem>
          <AllTrailsLink
            lat={latitude}
            long={longitude}
            text={`View ${mountainName} on `}
          />
        </BasicListItem>
      </VerticalContentItem>
      <VerticalContentItem>
        <ItemTitle>
          {getFluentString('local-trails-hiking-project-nearby-route')}
          <HikingProjectContainer>
            {getFluentString('local-trails-hiking-project-via-the')}
            <HikingProjectLogo href={generateHikingProjectLink(state)} target='_blank' rel='noopener noreferrer'>
              <img src={HikingProjectSvgLogo} alt='The Hiking Project' />
            </HikingProjectLogo>
          </HikingProjectContainer>
        </ItemTitle>
        {output}
      </VerticalContentItem>
    </>
  );
};

export default LocalTrails;
