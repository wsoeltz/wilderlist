import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import orderBy from 'lodash/orderBy';
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ORDINAL_NUMBER } from '../../../contextProviders/getFluentLocalizationContext';
import { listDetailWithMountainDetailLink } from '../../../routing/Utils';
import {
  lightBorderColor,
} from '../../../styling/styleUtils';
import { Mountain, PeakList } from '../../../types/graphQLTypes';
import {
  BasicUnorderedListContainer,
  BasicUnorderedListItem,
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
        numUsers
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
      numUsers: PeakList['numUsers'];
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
  mountainDatum: {
    id: string,
    name: string,
    state: {abbreviation: string},
    elevation: number,
  };
  getFluentString: GetString;
  numLists: number;
  setMetaDescription: boolean;
}

const IncludedLists = (props: Props) => {
  const { getFluentString, mountainDatum, numLists, setMetaDescription } = props;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_MOUNTAINS_INCLUDE_LISTS, {
    variables: { id: mountainDatum.id },
  });

  if (numLists === 0) {
    return null;
  }

  const getRank = (mountains: MountainDatum[], key: keyof MountainDatum) => {
    const sorted = orderBy(mountains, [key], ['desc']);
    return sorted.map(({id}) => id).indexOf(mountainDatum.id) + 1;
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
    let positionText: string | undefined;
    let placeText: string | undefined;
    let additionaltext: string | undefined;
    const sortedLists = orderBy(lists, ['numUsers'], ['desc']);
    const listsText = sortedLists.map((list, i) => {
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
      const percent = elevationRank / mountains.length;
      if (i === 0) {
        placeText = list.name;
        if (elevationRank === 1) {
          positionText = 'largest';
        } else if (elevationRank === mountains.length) {
          positionText = 'smallest';
        } else if (percent > 0.7) {
          positionText = ORDINAL_NUMBER([mountains.length - elevationRank]) + ' smallest';
        } else {
          positionText = ORDINAL_NUMBER([elevationRank]) + ' largest';
        }
        additionaltext = additionaltext === undefined && positionText && placeText
          ? ` and is the ${positionText} point on the ${placeText}` : undefined;
      }

      return (
        <BasicUnorderedListItem key={list.id}>
          <Link
            to={listDetailWithMountainDetailLink(list.id, mountainDatum.id)}
          >
            {list.name}
          </Link>
          {' '}
          {getFluentString('mountain-detail-lists-mountain-appears-on-ranks', {
            'elevation-rank': ORDINAL_NUMBER([elevationRank]),
          })}
        </BasicUnorderedListItem>
      );
    });

    const listsContent = listsText.length < 1 ? null : (
        <VerticalContentItem>
          <ItemTitle>
            {getFluentString('mountain-detail-lists-mountain-appears-on', {
              'mountain-name': mountainDatum.name,
            })}
          </ItemTitle>
          <BasicUnorderedListContainer>
            {listsText}
          </BasicUnorderedListContainer>
        </VerticalContentItem>
      );

    const metaDescription = getFluentString('meta-data-mountain-detail-description', {
      name: mountainDatum.name,
      elevation: mountainDatum.elevation,
      state: mountainDatum.state && mountainDatum.state.abbreviation ? ', ' + mountainDatum.state.abbreviation : '',
      additionaltext,
    });

    const header = setMetaDescription ? (
      <Helmet>
        <meta
          name='description'
          content={metaDescription}
        />
        <meta
          property='og:description'
          content={metaDescription}
        />
      </Helmet>
    ) : null;

    return (
      <>
        {header}
        {listsContent}
      </>
    );
  } else {
    return null;
  }

};

export default IncludedLists;