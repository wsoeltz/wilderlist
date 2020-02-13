import React from 'react';
import styled from 'styled-components';
import Image404Url from '../../assets/images/404.gif';
import { searchListDetailLink, searchMountainsDetailLink } from '../../routing/Utils';
import {ContentFull} from '../../styling/Grid';
import { ButtonPrimaryLink } from '../../styling/styleUtils';

const Root = styled(ContentFull)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
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
`;

const PageNotFound = () => {
  return (
    <Root>
      <Image src={Image404Url} />
      <h1>
        The page you are looking for seems to be off the trail.
      </h1>
      <p>
        Try searching what you are looking for at one of the following pages -
      </p>
      <ButtonContainer>
        <Button to={searchListDetailLink('search')}>Search Hiking Lists</Button>
        <Button to={searchMountainsDetailLink('search')}>Search Mountains</Button>
      </ButtonContainer>
      <p>
        <small>
          If you think this page should be here, contact us at
          {' '}
          <a href='mailto: wilderlistapp@gmail.com'>wilderlistapp@gmail.com</a>.
        </small>
      </p>
    </Root>
    );
};

export default PageNotFound;
