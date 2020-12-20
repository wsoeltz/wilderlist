import React from 'react';
import {
  ContentBody,
  ContentFull,
} from '../../styling/Grid';
import LoadingSpinner from './LoadingSpinner';

const LoadingSuspense = () => (
  <ContentFull>
    <ContentBody>
      <LoadingSpinner />
    </ContentBody>
  </ContentFull>
);

export default LoadingSuspense;
