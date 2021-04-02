import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  lightBorderColor,
  primaryColor,
} from '../../../styling/styleUtils';

const Root = styled.div`
  margin-top: -0.5rem;
  width: 6.25rem;
`;
const Text = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const CompleteText = styled.strong`
  margin-left: 0.3rem;
  text-transform: uppercase;
  font-size: 0.75em;
`;

const BarBackground = styled.div`
  width: 100%;
  height: 0.25rem;
  border: solid 1px ${lightBorderColor};
  display: flex;
`;

const BarFill = styled.div`
  height: 100%;
  background-color: ${primaryColor};
`;

const SimplePercentBar = ({percent, text}: {percent: number, text?: string}) => {
  const getString = useFluent();
  const completeText = text !== undefined ? text : getString('global-text-value-complete');
  return (
    <Root>
      <Text>
        <strong>{percent}%</strong> <CompleteText>{completeText}</CompleteText>
      </Text>
      <BarBackground>
        <BarFill style={{width: percent + '%'}} />
      </BarBackground>
    </Root>
  );
};

export default SimplePercentBar;
