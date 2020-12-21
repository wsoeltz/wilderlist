import React from 'react';
import styled from 'styled-components';
import Image404Url from '../../assets/images/404.gif';
import useFluent from '../../hooks/useFluent';
import { listDetailLink, mountainDetailLink } from '../../routing/Utils';
import {ContentFull} from '../../styling/Grid';
import { ButtonPrimaryLink } from '../../styling/styleUtils';

const Root = styled(ContentFull)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
`;

const Button = styled(ButtonPrimaryLink)`
  margin: 0 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  opacity: 0.75;
  max-width: 100%;
  width: 500px;
`;

const PageNotFound = () => {
  const getString = useFluent();

  return (
    <Root>
      <Image src={Image404Url} />
      <h1>
        {getString('page-not-found-404-title')}
      </h1>
      <p>
        {getString('page-not-found-404-desc')}
      </p>
      <ButtonContainer>
        <Button to={listDetailLink('search')}>
          {getString('global-text-value-search-hiking-lists')}
        </Button>
        <Button to={mountainDetailLink('search')}>
          {getString('global-text-value-search-mountains')}
        </Button>
      </ButtonContainer>
      <p>
        <small
          dangerouslySetInnerHTML={{__html: getString('page-not-found-404-contact')}}
        />
      </p>
    </Root>
    );
};

export default PageNotFound;
