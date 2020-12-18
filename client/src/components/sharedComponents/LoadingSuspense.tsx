import React from 'react';
import {
  ContentBody,
  ContentFull,
} from '../../styling/Grid';
import LoadingSpinner from './LoadingSpinner';

const LoadingSuspense = () => {

  return (
    <>
      <ContentFull>
        <ContentBody>
          <LoadingSpinner />
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default LoadingSuspense;
