import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
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
  onClick?: () => void;
}

const BackButton = (props: Props) => {
  const { history } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const onClick = props.onClick !== undefined ? props.onClick : history.goBack;

  return (
    <Button onClick={onClick}>
      <Caret icon={'chevron-left'} />
      {getFluentString('global-text-value-back')}
    </Button>
  );
};

export default withRouter(BackButton);
