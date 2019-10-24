import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import React from 'react';
import styled from 'styled-components';
import { listDetailWithMountainDetailLink } from '../../../routing/Utils';
import {
  lightBorderColor,
} from '../../../styling/styleUtils';
import { Mountain, PeakList } from '../../../types/graphQLTypes';
import {
  BasicListItem,
  BoldLink,
  ItemTitle,
  VerticalContentItem,
} from './sharedStyling';

const PlaceholderBlock = styled.div`
  width: 70%;
  height: 0.9rem;
  background-color: ${lightBorderColor};
`;

const GET_MOUNTAINS_INCLUDE_LISTS = gql`
  query getMountainsIncludedLists($id: ID!) {
    mountain(id: $id) {
      id
      lists {
        id
        name
        mountains {
          id
          elevation
        }
        parent {
          id
          mountains {
            id
            elevation
          }
        }
      }
    }
  }
`;

interface MountainDatum {
  id: Mountain['id'];
  elevation: Mountain['elevation'];
}

interface QuerySuccessResponse {
  mountain: {
    id: Mountain['name'];
    lists: Array<{
      id: PeakList['id'];
      name: PeakList['name'];
      mountains: MountainDatum[];
      parent: {
        id: PeakList['id'];
        mountains: MountainDatum[];
      }
    }>;
  };
}

interface QueryVariables {
  id: string;
}

interface Props {
  mountainId: string;
  mountainName: string;
  getFluentString: GetString;
  numLists: number;
}

const IncludedLists = (props: Props) => {
  const { mountainId, getFluentString, numLists, mountainName } = props;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAINS_INCLUDE_LISTS, {
    variables: { id: mountainId },
  });

  if (numLists === 0) {
    return null;
  }

  const getRank = (mountains: MountainDatum[], key: keyof MountainDatum) => {
    const sorted = sortBy(mountains, [key]).reverse();
    return sorted.map(({id}) => id).indexOf(mountainId) + 1;
  };

  if (loading === true) {
    const listPlaceholder: Array<React.ReactElement<any>> = [];
    for (let i = 0; i < numLists; i++) {
      listPlaceholder.push(<PlaceholderBlock key={i} />);
    }
    return (
      <>
        {listPlaceholder}
      </>
    );
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { mountain: {lists} } = data;
    const listsText = lists.map((list) => {
      const { parent } = list;
      let mountains: MountainDatum[];
      if (parent !== null && parent.mountains !== null) {
        mountains = parent.mountains;
      } else if (list.mountains !== null) {
        mountains = list.mountains;
      } else {
        mountains = [];
      }
      const elevationRank = getRank(mountains, 'elevation');
      return (
        <BasicListItem key={list.id}>
          <BoldLink
            to={listDetailWithMountainDetailLink(list.id, mountainId)}
          >
            {list.name}
          </BoldLink>
          {' '}
          {getFluentString('mountain-detail-lists-mountain-appears-on-ranks', {
            'elevation-rank': elevationRank,
          })}
        </BasicListItem>
      );
    });

    const listsContent = listsText.length < 1 ? null : (
        <VerticalContentItem>
          <ItemTitle>
            {getFluentString('mountain-detail-lists-mountain-appears-on', {
              'mountain-name': mountainName,
            })}
          </ItemTitle>
          {listsText}
        </VerticalContentItem>
      );

    return (
      <>
        {listsContent}
      </>
    );
  } else {
    return null;
  }

};

export default IncludedLists;
