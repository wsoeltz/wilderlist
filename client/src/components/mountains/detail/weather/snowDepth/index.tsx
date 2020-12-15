import {faSnowflake} from '@fortawesome/free-solid-svg-icons';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../../../contextProviders/getFluentLocalizationContext';
import {
  BasicIconInText,
  lightBaseColor,
} from '../../../../../styling/styleUtils';
import LoadingSpinner from '../../../../sharedComponents/LoadingSpinner';
import {ItemTitle} from '../../sharedStyling';
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

const Title = styled.strong`
  margin-bottom: 0.2rem;
  white-space: nowrap;
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
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);
  const {loading, error, data} = useSnowReport(input);

  let output: React.ReactElement<any> | null;
  if (error !== undefined) {
    return null;
  } else if (loading) {
    output = (
      <Root>
        <LoadingContainer>
          <LoadingSpinner
            message={{
              basic: getFluentString('snow-report-loading'),
              medium: getFluentString('snow-report-loading'),
              long: getFluentString('snow-report-loading'),
              extraLong: getFluentString('snow-report-loading'),
            }}
          />
        </LoadingContainer>
      </Root>
    );
  } else if (data) {
    const {snowfall, snowdepth} = data;
    const attributions = snowfall.stationName === snowdepth.stationName ? (
      <div>
        <Attribution>
          {getFluentString('snow-report-full-attr', {
            station: snowfall.stationName,
            county: snowfall.county,
            state: input.stateAbbr,
          })}
          <br />
          {getFluentString('snow-report-location-details', {
            distance: parseFloat(snowfall.distance.toFixed(2)),
            elevation: snowfall.elevation,
          })}
        </Attribution>
      </div>
    ) : (
      <>
        <div>
          <Attribution>
            {getFluentString('snow-report-snowfall-attr', {
              station: snowfall.stationName,
              county: snowfall.county,
              state: input.stateAbbr,
            })}
            <br />
            {getFluentString('snow-report-location-details', {
              distance: parseFloat(snowfall.distance.toFixed(2)),
              elevation: snowfall.elevation,
            })}
          </Attribution>
        </div>
        <div>
          <Attribution>
            {getFluentString('snow-report-snowdepth-attr', {
              station: snowdepth.stationName,
              county: snowdepth.county,
              state: input.stateAbbr,
            })}
            <br />
            {getFluentString('snow-report-location-details', {
              distance: parseFloat(snowdepth.distance.toFixed(2)),
              elevation: snowdepth.elevation,
            })}
          </Attribution>
        </div>
      </>
    );

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const reportDays = snowfall.values.map((report, i) => {
      const { date, value } = report;
      const dateAsText = getFluentString('global-formatted-text-date-day-month', {
        day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear().toString(),
      });

      const yesterdayText = date.getDate() === yesterday.getDate()
        ? getFluentString('global-text-value-yesterday') + ', ' : '';

      const snowfallVal = typeof value === 'number' ? value + '"' : <small>{value}</small>;
      const snowdepthVal = typeof snowdepth.values[i].value === 'number'
        ? snowdepth.values[i].value + '"' : <small>{snowdepth.values[i].value}</small>;
      return (
        <ForecastBlock key={dateAsText}>
          <Title>{yesterdayText} {dateAsText}</Title>
          <SnowItem>
            <span>{getFluentString('snow-report-new-snow')}:</span> <Value>{snowfallVal}</Value>
            <span>{(getFluentString('snow-report-current-depth'))}:</span> <Value>{snowdepthVal}</Value>
          </SnowItem>
        </ForecastBlock>
      );
    });
    output = (
      <>
        {attributions}
        <Root>
          {reportDays}
        </Root>
      </>
    );
  } else {
    output = <Root />;
  }

  return (
    <>
      <ItemTitle>
        <BasicIconInText icon={faSnowflake} />{getFluentString('mountain-detail-snow-depth')}
      </ItemTitle>
      {output}
    </>
  );
};

export default React.memo(SnowDepth);
