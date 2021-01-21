import {faSnowflake} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styled from 'styled-components';
import useFluent from '../../../../../../hooks/useFluent';
import {ItemTitle} from '../../../../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  lightBaseColor,
} from '../../../../../../styling/styleUtils';
import LoadingSpinner from '../../../../../sharedComponents/LoadingSpinner';
import {
  ForecastBlock,
  ForecastRootContainer,
  LoadingContainer,
} from '../Utils';
import useSnowReport, {Input} from './useSnowReport';

const Root = styled(ForecastRootContainer)`
  margin-top: 1rem;
  min-height: 60px;
`;

const PanelTitle = styled(ItemTitle)`
  padding: 1rem 1rem 0;
`;

const Title = styled.strong`
  margin: 0.2rem;
  white-space: nowrap;
`;

const AttributionContainer = styled.div`
  padding: 0 1rem 0;
`;

const Attribution = styled.small`
  display: block;
  margin-top: 0.3rem;
`;

const SnowItem = styled.p`
  margin: 0.1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.4rem;
  color: ${lightBaseColor};
  font-size: 0.75rem;
  white-space: nowrap;
`;

const Value = styled.strong`
  margin-left: 0.15rem;
  text-transform: uppercase;
  text-align: right;
`;

const SnowDepth = (input: Input) => {
  const getString = useFluent();

  const {loading, error, data} = useSnowReport(input);

  let output: React.ReactElement<any> | null;
  if (error !== undefined) {
    return null;
  } else if (loading) {
    output = (
      <Root hideScrollbars={false}>
        <LoadingContainer>
          <LoadingSpinner
            message={{
              basic: getString('snow-report-loading'),
              medium: getString('snow-report-loading'),
              long: getString('snow-report-loading'),
              extraLong: getString('snow-report-loading'),
            }}
          />
        </LoadingContainer>
      </Root>
    );
  } else if (data) {
    const {snowfall, snowdepth} = data;
    const attributions = snowfall.stationName === snowdepth.stationName ? (
      <AttributionContainer>
        <Attribution>
          {getString('snow-report-full-attr', {
            station: snowfall.stationName,
            county: snowfall.county,
            state: input.stateAbbr,
          })}
          <br />
          {getString('snow-report-location-details', {
            distance: parseFloat(snowfall.distance.toFixed(2)),
            elevation: snowfall.elevation,
          })}
        </Attribution>
      </AttributionContainer>
    ) : (
      <>
        <AttributionContainer>
          <Attribution>
            {getString('snow-report-snowfall-attr', {
              station: snowfall.stationName,
              county: snowfall.county,
              state: input.stateAbbr,
            })}
            <br />
            {getString('snow-report-location-details', {
              distance: parseFloat(snowfall.distance.toFixed(2)),
              elevation: snowfall.elevation,
            })}
          </Attribution>
        </AttributionContainer>
        <AttributionContainer>
          <Attribution>
            {getString('snow-report-snowdepth-attr', {
              station: snowdepth.stationName,
              county: snowdepth.county,
              state: input.stateAbbr,
            })}
            <br />
            {getString('snow-report-location-details', {
              distance: parseFloat(snowdepth.distance.toFixed(2)),
              elevation: snowdepth.elevation,
            })}
          </Attribution>
        </AttributionContainer>
      </>
    );

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const reportDays = snowfall.values.map((report, i) => {
      const { date, value } = report;
      const dateAsText = getString('global-formatted-text-date-day-month', {
        day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear().toString(),
      });

      const yesterdayText = date.getDate() === yesterday.getDate()
        ? getString('global-text-value-yesterday') + ', ' : '';

      const snowfallVal = typeof value === 'number' ? value + '"' : <small>{value}</small>;
      const snowdepthVal = typeof snowdepth.values[i].value === 'number'
        ? snowdepth.values[i].value + '"' : <small>{snowdepth.values[i].value}</small>;
      return (
        <ForecastBlock key={dateAsText}>
          <Title>{yesterdayText} {dateAsText}</Title>
          <SnowItem>
            <span>{getString('snow-report-new-snow')}:</span> <Value>{snowfallVal}</Value>
            <span>{(getString('snow-report-current-depth'))}:</span> <Value>{snowdepthVal}</Value>
          </SnowItem>
        </ForecastBlock>
      );
    });
    output = (
      <>
        {attributions}
        <Root hideScrollbars={false}>
          {reportDays}
        </Root>
      </>
    );
  } else {
    output = <Root />;
  }

  return (
    <>
      <PanelTitle>
        <BasicIconInText icon={faSnowflake} />{getString('mountain-detail-snow-depth')}
      </PanelTitle>
      {output}
    </>
  );
};

export default React.memo(SnowDepth);
