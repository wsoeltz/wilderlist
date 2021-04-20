import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import {
  GhostButton,
} from '../../styling/styleUtils';

const Button = styled(GhostButton)`
  margin: 0.5rem 0;
`;

const Caret = styled(FontAwesomeIcon)`
  margin-right: 0.6rem;
`;

interface Props extends RouteComponentProps {
  text?: string;
  onClick?: () => void;
}

const BackButton = (props: Props) => {
  const { history } = props;

  const getString = useFluent();

  const onClick = props.onClick !== undefined ? props.onClick : history.goBack;
  const text = props.text ? props.text : getString('global-text-value-back');

  return (
    <Button onClick={onClick}>
      <Caret icon={'chevron-left'} />
      {text}
    </Button>
  );
};

export default withRouter(BackButton);
