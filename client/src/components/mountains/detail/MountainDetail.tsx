import React from 'react';
import useFluent from '../../../hooks/useFluent';
import {useMountainDetail} from '../../../queries/mountains/useMountainDetail';
import { PlaceholderText } from '../../../styling/styleUtils';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Content from './Content';
import Header from './Header';

interface Props {
  id: string | null;
  setOwnMetaData?: boolean;
}

const MountainDetail = (props: Props) => {
  const { id, setOwnMetaData} = props;

  const getString = useFluent();

  const {loading, error, data} = useMountainDetail(id);

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
    const { mountain } = data;
    if (!mountain) {
      return (
        <PlaceholderText>
          {getString('global-error-retrieving-data')}
        </PlaceholderText>
      );
    } else {
      const {
        name, elevation, state, author, status,
      } = mountain;

      header = (
        <Header
          setOwnMetaData={setOwnMetaData ? setOwnMetaData : false}
          authorId={author ? author.id : null}
          id={id}
          name={name}
          elevation={elevation}
          state={state}
          status={status}
        />
      );

      body = (
        <Content
          setOwnMetaData={setOwnMetaData === true ? true : false}
          mountain={mountain}
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

export default MountainDetail;
