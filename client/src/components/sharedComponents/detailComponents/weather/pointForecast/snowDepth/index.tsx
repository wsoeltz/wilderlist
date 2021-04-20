import {
  faChartBar,
  faSnowflake,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components/macro';
import {StationDatum} from '../../../../../../hooks/servicesHooks/weather/simpleCache';
import useSnowReport from '../../../../../../hooks/servicesHooks/weather/useSnowReport';
import useFluent from '../../../../../../hooks/useFluent';
import {
  CenteredHeader,
  EmptyBlock,
  FittedBlock,
  HorizontalScrollContainer,
  InlineColumns,
  SimpleTitle,
} from '../../../../../../styling/sharedContentStyles';
import {
  baseColor,
  BasicIconInText,
  lightBaseColor,
  SmallExternalLink,
  Subtext,
} from '../../../../../../styling/styleUtils';
import LoadingSimple from '../../../../LoadingSimple';
import {
  Temperatures,
  TempHigh,
} from '../Utils';

const StationName = styled(Subtext)`
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  flex-shrink: 1;
  text-align: left;
`;

const Title = styled(CenteredHeader)`
  margin-bottom: 0.4rem;
  color: ${baseColor};
  font-size: 1rem;
  font-weight: 600;
  color: ${lightBaseColor};
`;

const DateText = styled.em`
  color: ${lightBaseColor};
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
`;

const getSnowValue = (data: StationDatum[]) => {
  const closestStations = data && data.length ? data.slice(0, 3) : [];
  const topValues = closestStations.map(({mostRecentValue}) => {
    const numberValue = parseFloat(mostRecentValue);
    if (isNaN(numberValue)) {
      return mostRecentValue === 'T' ? 'Trace Amounts' : 'No data';
    } else {
      return numberValue;
    }
  });
  const topNumbers = topValues.filter(val => typeof val === 'number') as number[];
  let min: number | string | null = topNumbers.length ? Math.min(...topNumbers) : null;
  if (min === null) {
    if (topValues.includes('Trace Amounts')) {
      min = 'Trace Amounts';
    }
  }
  let max: number | string | null = topNumbers.length ? Math.max(...topNumbers) : null;
  if (max === null) {
    if (topValues.includes('Trace Amounts')) {
      max = 'Trace Amounts';
    }
  }
  if (max === null && min === null) {
    return 'No data';
  }
  if (max === min || min === null) {
    if (typeof max === 'number') {
      return max + '"';
    } else {
      return max;
    }
  }
  const maxString = typeof max === 'number' ? max + '"' : max;
  return min + ' – ' + maxString;
};

interface Props {
  lat: number;
  lng: number;
  stateAbbr: string;
}

const SnowDepth = ({lat, lng, stateAbbr}: Props) => {
  const getString = useFluent();

  const {loading, error, data} = useSnowReport({coord: [lng, lat], stateAbbr});

  let output: React.ReactElement<any> | null;
  if (error) {
    output = <>{getString('snow-report-network-error')}</>;
  } else if (loading) {
    output = (
      <EmptyBlock>
        <CenteredHeader>
          <LoadingSimple />
          {getString('Getting your snow report')}...
        </CenteredHeader>
      </EmptyBlock>
    );
  } else if (data) {
    const snowFall = getSnowValue(data.snowFall);
    const snowFallSourceStations = data.snowFall && data.snowFall.length ? data.snowFall.slice(0, 3).map((station) => (
      <InlineColumns key={'snow-fall-source-station-' + station.ghcnid}>
        <StationName>
          <SmallExternalLink href={station.url} target={'_blank'}>{station.name}</SmallExternalLink>
        </StationName>
        <Subtext>
          {getString('snow-report-distance', {miles:  Math.round(station.distance), elevation: station.elevation})}
        </Subtext>
      </InlineColumns>
    )) : null;
    const snowFallDate = data.snowFall && data.snowFall[0]
      ? getString('snow-report-7-day-total', {date: getString('global-formatted-text-date-day-month', {
          day: data.snowFall[0].day, month: data.snowFall[0].month,
        })})
      : '';

    const snowDepth = getSnowValue(data.snowDepth);
    const snowDepthSourceStations = data.snowDepth && data.snowDepth.length
      ? data.snowDepth.slice(0, 3).map((station) => (
        <InlineColumns key={'snow-Depth-source-station-' + station.ghcnid}>
          <StationName>
            <SmallExternalLink href={station.url} target={'_blank'}>{station.name}</SmallExternalLink>
          </StationName>
          <Subtext>
            {getString('snow-report-distance', {miles:  Math.round(station.distance), elevation: station.elevation})}
          </Subtext>
        </InlineColumns>
      )) : null;
    const snowDepthDate = data.snowDepth && data.snowDepth[0]
      ? getString('snow-report-as-of', {date: getString('global-formatted-text-date-day-month', {
          day: data.snowDepth[0].day, month: data.snowDepth[0].month,
        })})
      : '';
    output = (
      <>
        <FittedBlock>
          <Title>
            <div>
              <BasicIconInText icon={faSnowflake} />
              {getString('snow-report-new-snow')}
            </div>
          </Title>
          <Temperatures>
            <TempHigh>{snowFall}</TempHigh>
          </Temperatures>
          <DateText>
            {snowFallDate}
          </DateText>
          <InlineColumns>
            <Subtext>
              <SimpleTitle>{getString('snow-report-source-stations')}:</SimpleTitle>
            </Subtext>
          </InlineColumns>
          {snowFallSourceStations}
        </FittedBlock>

        <FittedBlock>
          <Title>
            <div>
              <BasicIconInText icon={faChartBar} />
              {getString('snow-report-current-depth')}
            </div>
          </Title>
          <Temperatures>
            <TempHigh>{snowDepth}</TempHigh>
          </Temperatures>
          <DateText>
            {snowDepthDate}
          </DateText>
          <InlineColumns>
            <Subtext>
              <SimpleTitle>{getString('snow-report-source-stations')}:</SimpleTitle>
            </Subtext>
          </InlineColumns>
          {snowDepthSourceStations}
        </FittedBlock>
      </>
    );

  } else {
    output = null;
  }

  return (
    <>
      <HorizontalScrollContainer hideScrollbars={false} $noScroll={true}>
        {output}
      </HorizontalScrollContainer>
    </>
  );

};

export default React.memo(SnowDepth);
