import raw from 'raw.macro';
import styled from 'styled-components/macro';

export const mountainNeutralSvg = raw('../../assets/images/icons/mountain-neutral.svg');
export const trailDefaultSvg = raw('../../assets/images/icons/trail-default.svg');
export const tentNeutralSvg = raw('../../assets/images/icons/tent-neutral.svg');

export const IconContainer = styled.div<{$color: string}>`
  margin-right: 0.25rem;
  margin-top: 0.1em;
  font-size: 0.85em;
  color: ${({$color}) => $color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem;

    .fill-path {
      fill: ${({$color}) => $color};
    }
    .stroke-path {
      fill: #fff;
    }
  }
`;
