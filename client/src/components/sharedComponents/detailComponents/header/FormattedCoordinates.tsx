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
`;

interface Props {
  coordinates: Coordinate | undefined;
}

const FormattedCoordinates = ({coordinates}: Props) => {
  const formatted = coordinates ? convertDMS(coordinates[1], coordinates[0]) : undefined;
  const text = formatted ? (<>{`${formatted.lat}, `}<wbr />{`${formatted.long}`}</>) : '----';
  const onCopyClick = useCallback(() => {
    if (coordinates) {
      navigator.clipboard.writeText(coordinates[1] + ', ' + coordinates[0]);
    }
  }, [coordinates]);
  const copyButton = coordinates ? (
    <LinkButtonCompact onClick={onCopyClick}>
      <BasicIconAtEndOfText
        icon={faCopy}
      />
    </LinkButtonCompact>
  ) : null;
  return (
    <Root>
      {text}
      {copyButton}
    </Root>
  );
};

export default FormattedCoordinates;
