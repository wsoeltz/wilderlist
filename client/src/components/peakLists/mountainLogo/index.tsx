/* tslint:disable:max-line-length */
import React from 'react';
import styled from 'styled-components';
import { ColorSet, colorSetGray, getColorSetFromVariant } from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import Badge from './Badge';
import Ribbon from './Ribbon';

interface StyleProps {
  colorSet: ColorSet;
}
interface ShortNameProps {
  colorSet: ColorSet;
  shortNameSize: string;
  shortNameStroke: string;
}

export const classNames = {
  mountainExterior: 'mountain-exterior',
  mountainInterior: 'mountain-interior',
  sky: 'emblem-sky',
  mountainLogoTitleText: 'mountain-logo-title-text',
  variantName: 'variant-name',
  shortName: 'short-name',
};

const Root = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;

  justify-content: center;
`;

const BadgeGridContainer = styled.div`
  grid-row: 1;
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RibbonGridContainer = styled.div`
  grid-row: 1;
  grid-column: 1;
  height: 100%;
  justify-content: center;
`;

const BadgeSVGContainer = styled.div`
  position: relative;
  transition: all 0.2s ease-in-out;
`;

const SVG = styled.svg<StyleProps>`
  width: 100%;

  .${classNames.mountainLogoTitleText} {
    transition: all 0.2s ease-in-out;
    font-family: DeliciousWeb;
    font-size: 73px;
    text-align: center;
    fill: ${({colorSet}) => colorSet.primary};
  }

  .${classNames.mountainExterior} {
    transition: all 0.2s ease-in-out;
    fill: ${({colorSet}) => colorSet.primary};
    stroke: ${({colorSet}) => colorSet.primary};
    stroke-width: 4px;
  }

  .${classNames.mountainInterior} {
    transition: all 0.2s ease-in-out;
    fill: ${({colorSet}) => colorSet.secondary};
    stroke: ${({colorSet}) => colorSet.secondary};
    stroke-width: 4px;
  }

  .${classNames.sky} {
    transition: all 0.2s ease-in-out;
    fill: ${({colorSet}) => colorSet.tertiary};
    stroke: ${({colorSet}) => colorSet.tertiary};
    stroke-width: 4px;
  }
`;

const ShortName = styled.svg<ShortNameProps>`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 15%;

  text {
    transition: all 0.2s ease-in-out;
    font-family: DeliciousWeb;
    font-size: ${({shortNameSize}) => shortNameSize};
    fill: #fff;
    stroke: ${({colorSet}) => colorSet.primary};
    stroke-width: ${({shortNameStroke}) => shortNameStroke}px;
  }
`;
const VariantName = styled.svg<StyleProps>`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  text {
    transition: all 0.2s ease-in-out;
    font-size: 0.45rem;
    font-family: DeliciousWeb;
    text-transform: uppercase;
    fill: ${({colorSet}) => colorSet.primary};
  }
`;

const variantEnumToString = (variantEnum: PeakListVariants) => {
  if (variantEnum === PeakListVariants.standard) {
    return '';
  } else if (variantEnum === PeakListVariants.fourSeason) {
    return '4-season';
  } else {
    return variantEnum;
  }
};

interface Props {
  id: string;
  title: string;
  shortName: string;
  variant: PeakListVariants;
  active: boolean;
  completed: boolean;
}

const MountainLogo = (props: Props) => {
  const { id, title, shortName, variant, active, completed } = props;
  const titleId = 'mountainLogoTitle-' + id;
  const colorSet = active === true ? getColorSetFromVariant(variant) : colorSetGray;
  const shortNameSize = shortName.length > 7 ? '0.7rem' : '1rem';
  const shortNameStroke = shortName.length > 7 ? '0.5' : '0.7';
  const variantName = variant === PeakListVariants.standard ? null : (
    <VariantName
      colorSet={colorSet}
      viewBox='0 0 56 18'
      textAnchor='middle'
    >
      <text x='50%' y='90%'>
        {variantEnumToString(variant)}
      </text>
    </VariantName>
  );
  const badgeCompletionStyles: React.CSSProperties = (completed === false || active === false) ? {} : {
    width: '60%',
  };
  const ribbon = (completed === false || active === false) ? null : (
    <RibbonGridContainer>
      <Ribbon fill={colorSet.primary} />
    </RibbonGridContainer>
  );
  return (
    <Root>
      <BadgeGridContainer>
        <BadgeSVGContainer style={badgeCompletionStyles}>
          <SVG
            colorSet={colorSet}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 820.33 820.33'
          >
            <defs>
              <path id={titleId} fill='none' d='M184.91,609.63A305,305,0,0,1,104,402.33C104,233.26,241.1,96.21,410.16,96.21S716.29,233.26,716.29,402.33a305,305,0,0,1-76,201.88'
              x='0' y='0'/>
            </defs>

            <Badge id={id} />

            <text>
              <textPath
                href={`#${titleId}`}
                className={classNames.mountainLogoTitleText}
                startOffset='50%'
                textAnchor='middle'
              >
                {title}
              </textPath>
            </text>
          </SVG>
          <ShortName
            colorSet={colorSet}
            viewBox='0 0 56 18'
            textAnchor='middle'
            shortNameSize={shortNameSize}
            shortNameStroke={shortNameStroke}
          >
            <text x='50%' y='70%'>
              {shortName}
            </text>
          </ShortName>
          {variantName}
        </BadgeSVGContainer>
      </BadgeGridContainer>
      {ribbon}
    </Root>
  );
};

export default MountainLogo;
