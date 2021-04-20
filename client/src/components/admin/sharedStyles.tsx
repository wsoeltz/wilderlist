import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  ButtonSecondary,
  lightBorderColor,
  LinkButton,
} from '../../styling/styleUtils';

export const SubNav = styled.nav`
  display: flex;
`;

export const NavButtonLink = styled(LinkButton)`
  padding: 1rem;
  font-size: 1.2rem;
`;

const ListItemRoot = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${lightBorderColor};
  position: relative;
`;

const TitleContainer = styled.div`
  margin-bottom: 0.6rem;
  font-size: 1.2rem;
`;

const ButtonContainer = styled.div`
  position: absolute;
  font-size: 0.75rem;
  top: 8px;
  right: 8px;
`;

interface ListItemProps {
  title: string;
  url: string;
  content: React.ReactNode | null;
  onDelete: () => void;
  titleColor?: string;
}

export const ListItem = (props: ListItemProps) => {
  const { title, content, onDelete, titleColor, url } = props;

  return (
    <ListItemRoot>
      <TitleContainer>
        <Link
          to={url}
          style={{color: titleColor}}
        >
          {title}
        </Link>
      </TitleContainer>
      {content}
      <ButtonContainer>
        <ButtonSecondary onClick={onDelete}>
          Delete
        </ButtonSecondary>
      </ButtonContainer>
    </ListItemRoot>
  );
};
