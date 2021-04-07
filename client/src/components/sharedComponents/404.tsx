import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import Image404Url from '../../assets/images/404.gif';
import useFluent from '../../hooks/useFluent';
import {
  campsiteDetailLink,
  listDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../routing/Utils';
import {ContentContainer} from '../../styling/Grid';

const Root = styled(ContentContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  pointer-events: all;
`;

const Button = styled(Link)`
  margin: 0.5rem;
  font-size: 0.875rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  opacity: 0.75;
  max-width: 100%;
  width: 500px;
  margin-bottom: 1rem;
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
        <Button to={trailDetailLink('search')}>
          {getString('global-text-value-search-trails')}
        </Button>
        <Button to={campsiteDetailLink('search')}>
          {getString('global-text-value-search-campsites')}
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
