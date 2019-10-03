import { GetString } from 'fluent-react';
import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import HikingProjectSvgLogo from '../../../assets/images/hiking-project-logo.svg';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import getTrails from '../../../utilities/getTrails';
import { genericWords } from '../../peakLists/import';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import {
  BasicListItem,
  ItemFooter,
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';

const HikingProjectLogo = styled.a`
  margin-left: 0.3rem;
  width: 110px;

  img {
    width: 100%;
  }
`;

const Beta = styled.sup`
  opacity: 0.8;
  font-size: 0.6rem;
  margin-left: 0.3rem;
`;

interface LatLong {
  latitude: number;
  longitude: number;
}

interface TrailsDatum {
  id: number;
  name: string;
  type: string;
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
}

const LocalTrails = ({mountainName, latitude, longitude}: Props) => {
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
    const trailElements: Array<React.ReactElement<any> | null> = [];
    trails.forEach(trail => {
      if (mtnNameSafe.some(function(v) { return v.length > 1 && trail.name.toLowerCase().indexOf(v) >= 0; }) ||
          mtnNameSafe.some(function(v) { return v.length > 1 && trail.summary.toLowerCase().indexOf(v) >= 0; })) {
        trailElements.unshift(
          <BasicListItem key={trail.id}>
            <a href={trail.url} target='_blank' rel='noopener noreferrer'><strong>{trail.name}</strong></a>
            {' - '}
            {getFluentString('local-trails-hiking-project-feet-elevation', {
              miles: trail.length,
              elevation: trail.ascent,
            })}
          </BasicListItem>,
        );
      }
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
    <VerticalContentItem>
      <ItemTitle>
        {getFluentString('local-trails-hiking-project-nearby-route')}
        <Beta>{getFluentString('local-trails-hiking-project-beta')}</Beta>
      </ItemTitle>
      {output}
      <ItemFooter>
        {getFluentString('local-trails-hiking-project-via-the')}
        <HikingProjectLogo href='https://www.hikingproject.com/' target='_blank' rel='noopener noreferrer'>
          <img src={HikingProjectSvgLogo} alt='The Hiking Project' />
        </HikingProjectLogo>
      </ItemFooter>
    </VerticalContentItem>
  );
};

export default LocalTrails;
