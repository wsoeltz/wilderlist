import { GetString } from 'fluent-react/compat';
import React, {RefObject, useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonPrimary,
  lightBorderColor,
  tertiaryColor,
} from '../../../styling/styleUtils';

const ColorScaleLegend = styled.div`
  padding: 0.6rem 0;
  border-top: 1px solid ${lightBorderColor};
  background-color: ${tertiaryColor};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const LegendTitle = styled.h4`
  margin: 0.3rem 0 0.6rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  text-align: center;
  font-weight: 600;
  width: 100%;
  flex-shrink: 0;
`;
const LegendItem = styled.div`
  margin: 0 0.3rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const circleSmallScreenSize = 400; // in px

const Circle = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 4000px;
  margin-bottom: 0.2rem;

  @media (max-width: ${circleSmallScreenSize}px) {
    width: 14px;
    height: 14px;
  }
`;

const GridLegendLabel = styled(LegendItem)`
  white-space: nowrap;
  width: 15px;

  @media (max-width: ${circleSmallScreenSize}px) {
    width: 14px;
  }
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
  centerCoords: [string, string];
  showCenterCrosshairs?: boolean;
  returnLatLongOnClick?: (lat: number | string, lng: number | string) => void;
  colorScaleTitle?: string;
  colorScaleColors: string[];
  colorScaleLabels: string[];
}

const ColorScale = React.forwardRef((props: Props, rootElRef: RefObject<HTMLDivElement>) => {
  const {
    centerCoords, colorScaleColors, colorScaleLabels,
    showCenterCrosshairs, returnLatLongOnClick,
    colorScaleTitle,
  } = props;
  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  if (colorScaleColors.length === 0) {
    return null;
  }

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
  const title = colorScaleTitle ? <LegendTitle>{colorScaleTitle}</LegendTitle> : null;
  const startColor = colorScaleColors[0];
  const endColor = colorScaleColors[colorScaleColors.length - 1];

  if (colorScaleColors.length <= 2) {
    const legendNodes = colorScaleColors.map((c, i) => {
      return (
        <LegendItem key={c}>
          <Circle style={{backgroundColor: c}} />
          {colorScaleLabels[i]}
        </LegendItem>
      );
    });
    return (
      <ColorScaleLegend ref={rootElRef}>
        {title}
        {latLongLegend}
        {legendNodes}
      </ColorScaleLegend>
    );
  } else if (colorScaleColors.length < 8) {
    const legendNodes = colorScaleColors.map((c) => {
      return (
        <LegendItem key={c}>
          <Circle style={{backgroundColor: c}} />
        </LegendItem>
      );
    });
    return (
      <ColorScaleLegend ref={rootElRef}>
        {title}
        <SeasonLabelStart style={{color: startColor}}>
          {colorScaleLabels[0]}
        </SeasonLabelStart>
        {legendNodes}
        <SeasonLabelEnd style={{color: endColor}}>
          {colorScaleLabels[colorScaleLabels.length - 1]}
        </SeasonLabelEnd>
      </ColorScaleLegend>
    );
  } else {
    const legendNodes = colorScaleColors.map((c, i) => {
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
    return (
      <ColorScaleLegend ref={rootElRef}>
        {title}
        <GridLabelStart style={{color: startColor}}>
          <Circle style={{backgroundColor: startColor}} />
          {colorScaleLabels[0]}
        </GridLabelStart>
        {legendNodes}
        <GridLabelEnd style={{color: endColor}}>
          <Circle style={{backgroundColor: endColor}} />
          {colorScaleLabels[colorScaleLabels.length - 1]}
        </GridLabelEnd>
      </ColorScaleLegend>
    );
  }
});

export default ColorScale;
