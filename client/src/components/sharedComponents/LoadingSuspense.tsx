import React from 'react';
import {
  ContentBody,
  ContentContainer,
} from '../../styling/Grid';
import LoadingSpinner from './LoadingSpinner';

const LoadingSuspense = () => (
  <ContentContainer>
    <ContentBody>
      <LoadingSpinner />
    </ContentBody>
  </ContentContainer>
);

export default LoadingSuspense;
