import { gql, useQuery } from '@apollo/client';
import React from 'react';
import useFluent from '../../../hooks/useFluent';
import { PlaceholderText } from '../../../styling/styleUtils';
import {
  Mountain,
  PeakList,
  State,
  User,
} from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Content from './Content';
import Header from './Header';

const GET_MOUNTAIN_DETAIL = gql`
  query getMountain($id: ID) {
    mountain(id: $id) {
      id
      name
      elevation
      location
      description
      resources {
        title
        url
      }
      state {
        id
        name
        abbreviation
      }
      lists {
        id
      }
      author {
        id
      }
      status
    }
  }
`;

interface QuerySuccessResponse {
  mountain: null | {
    id: Mountain['name'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    location: Mountain['location'];
    description: Mountain['description'];
    resources: Mountain['resources'];
    state: {
      id: State['id'];
      name: State['name'];
      abbreviation: State['abbreviation'];
    };
    lists: Array<{
      id: PeakList['id'];
    }>;
    author: null | { id: User['id'] };
    status: Mountain['status'];
  };
}

interface QueryVariables {
  id: string | null;
}

interface Props {
  id: string | null;
  setOwnMetaData?: boolean;
}

const MountainDetail = (props: Props) => {
  const { id, setOwnMetaData} = props;

  const getString = useFluent();

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAIN_DETAIL, {
    variables: { id },
  });

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
