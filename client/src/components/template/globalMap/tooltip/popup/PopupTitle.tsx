import React from 'react';
import styled from 'styled-components/macro';
import {
  lightBorderColor,
  primaryColor,
  primaryFont,
  primaryHoverColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';

const Root = styled.div`
  padding: 0.4rem 1rem 0.4rem 0.5rem;
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  grid-column-gap: 0.4rem;
  background-color: ${tertiaryColor};
  border-bottom: solid 1px ${lightBorderColor};
  font-size: 0.85rem;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;
  }
`;

const Image = styled.img`
  max-width: 24px;
  cursor: pointer;
`;

const ButtonLink = styled.button`
  border: none;
  background-color: transparent;
  font-family: ${primaryFont};
  color: ${primaryColor};
  text-decoration: underline;
  padding: 0;
  font-weight: 600;

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${primaryHoverColor};
  }
`;

interface TitleProps {
  title: string;
  subtitle: string;
  imgSrc: string;
  onClick: () => void;
}

const PopupTitle = ({title, subtitle, imgSrc, onClick}: TitleProps) => (
  <Root>
    <div>
      <Image src={imgSrc} title={title} alt={title} onClick={onClick} />
    </div>
    <div>
      <ButtonLink
        onClick={onClick}
      >
        {title}
      </ButtonLink>
      <small>
        {subtitle}
      </small>
    </div>
  </Root>
);

export default PopupTitle;
