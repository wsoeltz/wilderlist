import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import {GhostButton, primaryColor} from '../../styling/styleUtils';

const Root = styled(GhostButton)`
  color: ${primaryColor};
  width: 3.5rem;

  &:hover {
    color: ${primaryColor};
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
`;

interface Props {
  starred: boolean;
  toggleStarred: () => void;
}

const StarButton = ({starred, toggleStarred}: Props) => {
  const getString = useFluent();

  const text = starred ? getString('global-text-value-saved') : getString('global-text-value-save');
  const icon = starred ? faSolidStar : faOutlineStar;

  return (
    <Root onClick={toggleStarred}>
      <Icon icon={icon} />
      <div>{text}</div>
    </Root>
  );
};

export default StarButton;
