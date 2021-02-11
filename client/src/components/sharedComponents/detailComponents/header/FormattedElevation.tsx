import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';

const Root = styled.div`
  white-space: nowrap;
`;

interface Props {
  elevation: number | undefined;
}

const FormattedElevation = ({elevation}: Props) => {
  const getString = useFluent();

  const elevationText = elevation !== undefined
    ? (
      <>
        {elevation + ' ' + getString('global-text-value-feet') + ' '}
        <wbr />
        ({Math.round(elevation * 0.3048) + ' ' + getString('global-text-value-meters')})
      </>
    ) : '----';

  return (
    <Root>
      {elevationText}
    </Root>
  );
};

export default FormattedElevation;
