/* tslint:disable:max-line-length */
import React from 'react';
import styled from 'styled-components';
import { ColorSet, getColorSetFromVariant } from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import Badge from './Badge';

interface StyleProps {
  id: string;
  colorSet: ColorSet;
}

export const classNames = {
  mountainExterior: 'mountain-exterior',
  mountainInterior: 'mountain-interior',
  sky: 'emblem-sky',
};

const SVG = styled.svg<StyleProps>`
  font-family: DeliciousWeb;

  .mountainLogoTitleText {
    font-size: 73px;
    text-align: center;
    fill: ${({colorSet}) => colorSet.primary};
  }

  .variant-name {
    font-size: 102.73px;
    fill: ${({colorSet}) => colorSet.primary};
  }

  .short-name {
    font-family: DeliciousWeb;
    font-size: 218.43px;
    fill: #fff;
    stroke: ${({colorSet}) => colorSet.primary};
    stroke-miterlimit: 10;
    stroke-width: 8px;
  }

  .clear-fill {
    fill: none;
  }

  .${classNames.mountainExterior} {
    fill: ${({colorSet}) => colorSet.primary};
    stroke: ${({colorSet}) => colorSet.primary};
    stroke-width: 4px;
  }

  .${classNames.mountainInterior} {
    fill: ${({colorSet}) => colorSet.secondary};
    stroke: ${({colorSet}) => colorSet.secondary};
    stroke-width: 4px;
  }

  .${classNames.sky} {
    fill: ${({colorSet}) => colorSet.tertiary};
    stroke: ${({colorSet}) => colorSet.tertiary};
    stroke-width: 4px;
  }
`;

interface Props {
  id: string;
  title: string;
  shortName: string;
  variant: PeakListVariants;
}

const MountainLogo = (props: Props) => {
  const { id, title, shortName, variant } = props;
  const titleId = 'mountainLogoTitle-' + id;
  return (
    <SVG
      id={id}
      colorSet={getColorSetFromVariant(variant)}
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
          className='mountainLogoTitleText'
          startOffset='50%'
          textAnchor='middle'
        >
          {title}
        </textPath>
      </text>
      <text className={`variant-name`} transform='translate(316.73 787.36)'>{variant}</text>
      <text className={`short-name`} transform='translate(100.14 675.48)'>{shortName}</text>
    </SVG>
  );
};

export default MountainLogo;
