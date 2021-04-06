import {faCopy} from '@fortawesome/free-regular-svg-icons';
import React, {useCallback} from 'react';
import styled from 'styled-components/macro';
import {
  BasicIconAtEndOfText,
  LinkButtonCompact,
} from '../../../../styling/styleUtils';
import {Coordinate} from '../../../../types/graphQLTypes';
import {convertDMS} from '../../../../Utils';

const Root = styled.div`
  white-space: nowrap;
  padding-left: 0.45rem;
`;

interface Props {
  coordinates: Coordinate | undefined;
  decimal?: boolean;
  copyExact?: boolean;
  noPadding?: boolean;
}

const FormattedCoordinates = ({coordinates, decimal, copyExact, noPadding}: Props) => {
  const formatted = coordinates ? convertDMS(coordinates[1], coordinates[0]) : undefined;
  const text = decimal && coordinates
    ? `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`
    : formatted
      ? (<>{`${formatted.lat}, `}<wbr />{`${formatted.long}`}</>) : '----';
  const onCopyClick = useCallback(() => {
    if (coordinates) {
      const copyValue = copyExact && !decimal && formatted
        ? `${formatted.lat}, ${formatted.long}`
        : coordinates[1] + ', ' + coordinates[0];
      navigator.clipboard.writeText(copyValue);
    }
  }, [coordinates, copyExact, decimal, formatted]);
  const copyButton = coordinates ? (
    <LinkButtonCompact onClick={onCopyClick} aria-label='Copy'>
      <BasicIconAtEndOfText
        icon={faCopy}
      />
    </LinkButtonCompact>
  ) : null;
  return (
    <Root style={noPadding ? {padding: 0} : undefined}>
      {text}
      {copyButton}
    </Root>
  );
};

export default FormattedCoordinates;
