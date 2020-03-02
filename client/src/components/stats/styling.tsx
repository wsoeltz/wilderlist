import React from 'react';
import styled from 'styled-components';
import {
  primaryColor,
  primaryHoverColor,
} from '../../styling/styleUtils';

export const Root = styled.div`
  margin-bottom: 4rem;
`;

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 450px) {
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 1rem;
  }
`;
export const ThreeColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 650px) {
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr 1fr;
    grid-row-gap: 1rem;
  }
`;

const circleSize = '6rem';

const LargeStyledNumberRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: ${circleSize};
`;

const BigNumber = styled.div`
  font-family: DeliciousRomanWeb;
  font-size: 2.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: '';
    position: absolute;
    top: -20%;
    z-index: -1;
    width: ${circleSize};
    height: ${circleSize};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 200px;
    background-color: ${primaryHoverColor};
    border: solid 4px ${primaryColor};
  }
`;
const Label = styled.div`
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.2rem 0.3rem;
  border-radius: 5px;
  background-color: ${primaryColor};
  color: #fff;
  max-width: 190px;
`;

export const LargeStyledNumber = (
  {value, labelTop, labelBottom}: {value: number, labelTop: string, labelBottom: string}) => {
  let fontSize: string | undefined;
  if (value > 999999) {
    fontSize = '1.6rem';
  } else if (value > 99999) {
    fontSize = '1.85rem';
  } else if (value > 9999) {
    fontSize = '2.1rem';
  } else if (value > 999) {
    fontSize = '2.25rem';
  } else {
    fontSize = undefined;
  }
  const topLabelRadius: React.CSSProperties = labelTop.length < labelBottom.length
    ? {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    } : {};
  const bottomLabelRadius: React.CSSProperties = labelTop.length > labelBottom.length
    ? {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    } : {};
  return (
    <LargeStyledNumberRoot>
      <BigNumber style={{fontSize}}>{value}</BigNumber>
      <Label style={topLabelRadius}>
        {labelTop}
      </Label>
      <Label style={bottomLabelRadius}>
        {labelBottom}
      </Label>
    </LargeStyledNumberRoot>
  );
}