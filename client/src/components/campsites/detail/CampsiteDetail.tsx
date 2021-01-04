import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useCampsiteDetail} from '../../../queries/campsites/useCampsiteDetail';
import { PlaceholderText } from '../../../styling/styleUtils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Content from './Content';
import Header from './Header';

interface Props {
  id: string | null;
  setOwnMetaData?: boolean;
}

const CampsiteDetail = (props: Props) => {
  const { id, setOwnMetaData} = props;

  const getString = useFluent();

  const {loading, error, data} = useCampsiteDetail(id);

  let header: React.ReactElement<any> | null;
  let body: React.ReactElement<any> | null;
  if (id === null) {
    header = null;
    body = null;
  } else if (loading === true) {
    header = <LoadingSpinner />;
    body = null;
  } else if (error !== undefined) {
    console.error(error);
    header =  (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  } else if (data !== undefined) {
    const { campsite } = data;
    if (!campsite) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        name, author, status, state, type,
      } = campsite;

      header = (
        <Header
          setOwnMetaData={setOwnMetaData ? setOwnMetaData : false}
          authorId={author ? author.id : null}
          id={id}
          name={name}
          type={type}
          state={state}
          status={status}
        />
      );

      body = (
        <Content
          campsite={campsite}
        />
      );
    }
  } else {
    header = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
    body = null;
  }

  return (
    <>
      {header}
      {body}
    </>
  );
};

export default CampsiteDetail;
