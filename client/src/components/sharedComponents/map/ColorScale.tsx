import React, {useContext} from 'react';
import styled from 'styled-components';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import {
  ButtonPrimary,
  lightBorderColor,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { GetString } from 'fluent-react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { PeakListVariants } from '../../../types/graphQLTypes';

const ColorScaleLegend = styled.div`
  padding: 0.6rem 0;
  border-top: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  display: flex;
  justify-content: center;
`;
const LegendItem = styled.div`
  margin: 0 0.3rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Circle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 4000px;
  margin-bottom: 0.2rem;
`;

const GridLegendLabel = styled(LegendItem)`
  white-space: nowrap;
  width: 15px;
`;
const GridLabelStart = styled(GridLegendLabel)`
  align-items: flex-start;
`;
const GridLabelEnd = styled(GridLegendLabel)`
  align-items: flex-end;
`;

const SeasonLabelStart = styled(LegendItem)`
  justify-content: center;
`;
const SeasonLabelEnd = styled(LegendItem)`
  justify-content: center;
`;

const CenterCoordinatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: auto;
  margin-left: 1rem;
`;

const CenterCoordinatesTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`;

const CenterCoordinatesSection = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  font-size: 0.8rem;
`;

const ActionButton = styled(ButtonPrimary)`
  margin-top: 0.5rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.3rem;
`;

interface Props {
  peakListType: PeakListVariants;
  centerCoords: [string, string];
  createOrEditMountain?: boolean;
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
  colorScaleColors: string[];
}

const ColorScale = (props: Props) => {
  const {
    centerCoords, peakListType, colorScaleColors,
    createOrEditMountain, showCenterCrosshairs, returnLatLongOnClick,
  } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  let colorScaleLegend: React.ReactElement<any> | null;
  if (createOrEditMountain === true) {
    let latLongLegend: React.ReactElement<any> | null;
    if (showCenterCrosshairs === true) {
      const returnLatLongButton = returnLatLongOnClick === undefined ? null : (
        <ActionButton onClick={() => returnLatLongOnClick(...centerCoords)}>
          {getFluentString('map-set-lat-long-value')}
        </ActionButton>
      );
      latLongLegend = (
        <CenterCoordinatesContainer>
          <CenterCoordinatesTitle>{getFluentString('map-coordinates-at-center')}</CenterCoordinatesTitle>
          <CenterCoordinatesSection>
            <span>{getFluentString('global-text-value-latitude')}: {centerCoords[0]}</span>
            <span>{getFluentString('global-text-value-longitude')}: {centerCoords[1]}</span>
            {returnLatLongButton}
          </CenterCoordinatesSection>
        </CenterCoordinatesContainer>
      );
    } else {
      latLongLegend = null;
    }
    colorScaleLegend = (
      <ColorScaleLegend>
        {latLongLegend}
        <LegendItem>
          <Circle style={{backgroundColor: colorScaleColors[0]}} />
          {getFluentString('create-mountain-map-nearby-mountains')}
        </LegendItem>
        <LegendItem>
          <Circle style={{backgroundColor: colorScaleColors[1]}} />
          {getFluentString('create-mountain-map-your-mountain')}
        </LegendItem>
      </ColorScaleLegend>
    );
  } else if (peakListType === PeakListVariants.standard || peakListType === PeakListVariants.winter) {
    colorScaleLegend = (
      <ColorScaleLegend>
        <LegendItem>
          <Circle style={{backgroundColor: colorScaleColors[0]}} />
          {getFluentString('global-text-value-not-done')}
        </LegendItem>
        <LegendItem>
          <Circle style={{backgroundColor: colorScaleColors[1]}} />
          {getFluentString('global-text-value-done')}
        </LegendItem>
      </ColorScaleLegend>
    );
  } else if (peakListType === PeakListVariants.fourSeason) {
    const seasonCircles = colorScaleColors.map((c) => {
      return (
        <LegendItem key={c}>
          <Circle style={{backgroundColor: c}} />
        </LegendItem>
      );
    });
    colorScaleLegend = (
      <ColorScaleLegend>
        <SeasonLabelStart style={{color: colorScaleColors[0]}}>
          {getFluentString('map-no-seasons')}
        </SeasonLabelStart>
        {seasonCircles}
        <SeasonLabelEnd style={{color: colorScaleColors[4]}}>
          {getFluentString('map-all-seasons')}
        </SeasonLabelEnd>
      </ColorScaleLegend>
    );
  } else if (peakListType === PeakListVariants.grid) {
    const monthCircles = colorScaleColors.map((c, i) => {
      if (i === 0 || i === 12) {
        return null;
      } else {
        return (
          <LegendItem key={c}>
            <Circle style={{backgroundColor: c}} />
          </LegendItem>
        );
      }
    });
    colorScaleLegend = (
      <ColorScaleLegend>
        <GridLabelStart style={{color: colorScaleColors[0]}}>
          <Circle style={{backgroundColor: colorScaleColors[0]}} />
          {getFluentString('map-no-months')}
        </GridLabelStart>
        {monthCircles}
        <GridLabelEnd style={{color: colorScaleColors[12]}}>
          <Circle style={{backgroundColor: colorScaleColors[12]}} />
          {getFluentString('map-all-months')}
        </GridLabelEnd>
      </ColorScaleLegend>
    );
  } else {
    failIfValidOrNonExhaustive(peakListType, 'invalid value for ' + peakListType);
    colorScaleLegend = null;
  }


  return colorScaleLegend;
}

export default ColorScale;
