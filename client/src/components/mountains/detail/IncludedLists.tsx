import orderBy from 'lodash/orderBy';
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ORDINAL_NUMBER } from '../../../contextProviders/getFluentLocalizationContext';
import useFluent from '../../../hooks/useFluent';
import {
  MountainDatum,
  useGetIncludedListsForMountain,
} from '../../../queries/mountains/getIncludedLists';
import { listDetailLink } from '../../../routing/Utils';
import {
  lightBorderColor,
} from '../../../styling/styleUtils';
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

interface Props {
  mountainDatum: {
    id: string,
    name: string,
    state: {abbreviation: string},
    elevation: number,
  };
  numLists: number;
  setMetaDescription: boolean;
}

const IncludedLists = (props: Props) => {
  const { mountainDatum, numLists, setMetaDescription } = props;

  const getString = useFluent();

  const {loading, error, data} = useGetIncludedListsForMountain(mountainDatum.id);

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
            to={listDetailLink(list.id)}
          >
            {list.name}
          </Link>
          {' '}
          {getString('mountain-detail-lists-mountain-appears-on-ranks', {
            'elevation-rank': ORDINAL_NUMBER([elevationRank]),
          })}
        </BasicUnorderedListItem>
      );
    });

    const listsContent = listsText.length < 1 ? null : (
        <VerticalContentItem>
          <ItemTitle>
            {getString('mountain-detail-lists-mountain-appears-on', {
              'mountain-name': mountainDatum.name,
            })}
          </ItemTitle>
          <BasicUnorderedListContainer>
            {listsText}
          </BasicUnorderedListContainer>
        </VerticalContentItem>
      );

    const metaDescription = getString('meta-data-mountain-detail-description', {
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
