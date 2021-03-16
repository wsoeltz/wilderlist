import {
  faAlignLeft,
  faMousePointer,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components/macro';
import {useBasicMountainDetails} from '../../../../queries/mountains/useBasicMountainDetails';
import {mountainDetailLink} from '../../../../routing/Utils';
import {
  baseColor,
  BasicIconInText,
  IconContainer,
  primaryColor,
  tertiaryColor,
} from '../../../../styling/styleUtils';

const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
`;

const Container = styled.div`
  margin: 1rem 0 auto;
  text-align: left;
  color: #fff;

  small {
    font-weight: 400;
  }
`;

const Title = styled.h1`
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.small`
  font-size: 1rem;
  display: block;
`;

const HelperText = styled(Subtitle)`
  margin: 1.25rem 0 1.5rem;
  font-size: 0.875rem;
  font-style: italic;
`;

const linkStyles = css`
  background-color: #fff;
  border-radius: 4px;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0.35rem 0.5rem 0.55rem;
  box-shadow: 0 1px 3px 1px #d1d1d1;
  position: relative;
  outline: none;
  font-size: 1rem;
  white-space: nowrap;
  width: min-content;
  color: ${baseColor};
  pointer-events: all;

  &:hover {
    background-color: ${tertiaryColor};
  }
`;

const ExitButton = styled.button`
  ${linkStyles}
`;

const ExitLink = styled(Link)`
  ${linkStyles}
  text-decoration: none;
`;

const Content = ({id}: {id: string}) => {
  const {data} = useBasicMountainDetails(id);
  const { goBack, push } = useHistory();
  if (data && data.mountain) {
    const {name, locationText, elevation} = data.mountain;
    const onClick = () => {
      if (!document.referrer || document.referrer.includes('wilderlist') || document.referrer.includes('localhost')) {
        goBack();
      } else {
        push(mountainDetailLink(id));
      }
    };

    const exitButton = !document.referrer || document.referrer.includes('wilderlist') || document.referrer.includes('localhost')
      ? (
        <ExitButton onClick={onClick}>
          <IconContainer $color={primaryColor}>
            <BasicIconInText icon={faAlignLeft} />
          </IconContainer>
          Back to mountain details
        </ExitButton>
      ) : (
        <ExitLink to={mountainDetailLink(id)}>
          <IconContainer $color={primaryColor}>
            <BasicIconInText icon={faAlignLeft} />
          </IconContainer>
          Back to mountain details
        </ExitLink>
      );

    return (
      <Root>
        <Container>
          <Title>
            Summit View for {name}
          </Title>
          <Subtitle>{locationText}, {elevation}ft</Subtitle>
          <HelperText>
            <BasicIconInText icon={faMousePointer} /> Move your mouse to rotate the view
          </HelperText>
          {exitButton}
        </Container>
      </Root>
    );
  }

  return null;
};

export default Content;
