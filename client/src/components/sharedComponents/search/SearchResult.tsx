import {
  faList,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  IconContainer,
  primaryColor,
} from '../../../styling/styleUtils';
import {SearchResultType} from '../../../types/itemTypes';
import {
  mountainNeutralSvg,
  tentNeutralSvg,
  trailDefaultSvg,
} from '../svgIcons';
import {SearchResultDatum} from './Utils';

const Root = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Subtitle = styled.div`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
`;

interface Props {
  query: string;
  suggestion: SearchResultDatum;
  compact: boolean | undefined;
}

const SearchResult = ({query, suggestion, compact}: Props) => {
  const getString = useFluent();

  let subtitleText: string;
  let icon: React.ReactElement<any> | null;
  if (suggestion.type === SearchResultType.mountain) {
    subtitleText = suggestion.stateText[0]
      ? `${suggestion.stateText[0]}, ${suggestion.elevation}ft` : `${suggestion.elevation}ft`;
    icon = (
      <IconContainer
        $color={primaryColor}
        style={{
          width: compact ? '0.7rem' : undefined,
          marginRight: compact ? 0 : undefined,
        }}
        dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.trail) {
    const trailType = getString('global-formatted-trail-type', {type: suggestion.trailType});
    const states = suggestion.stateText.join(', ');
    subtitleText = states.length
      ? `${trailType.charAt(0).toUpperCase() + trailType.slice(1).replaceAll('_', ' ')} in ${states}`
      : trailType.charAt(0).toUpperCase() + trailType.slice(1).replaceAll('_', ' ');
    icon = (
      <IconContainer
        $color={primaryColor}
        style={{
          width: compact ? '0.7rem' : undefined,
          marginRight: compact ? 0 : undefined,
        }}
        dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.campsite) {
    const campsiteType = getString('global-formatted-campsite-type', {type: suggestion.campsiteType});
    const states = suggestion.stateText.join(', ');
    subtitleText = states.length
      ? `${campsiteType.charAt(0).toUpperCase() + campsiteType.slice(1).replaceAll('_', ' ')} in ${states}`
      : campsiteType.charAt(0).toUpperCase() + campsiteType.slice(1).replaceAll('_', ' ');
    icon = (
      <IconContainer
        $color={primaryColor}
        style={{
          width: compact ? '0.7rem' : undefined,
          marginRight: compact ? 0 : undefined,
        }}
        dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.list) {
    const states = suggestion.stateText.join(', ');
    subtitleText = states.length ? `${suggestion.numPeaks} peaks in ${states}` : `${suggestion.numPeaks} peaks`;
    icon = (
      <IconContainer
        $color={primaryColor}
        style={{fontSize: compact ? '0.7rem' : undefined}}
      >
        <FontAwesomeIcon icon={faList} />
      </IconContainer>
    );
  } else if (suggestion.type === SearchResultType.geolocation) {
    subtitleText = suggestion.locationName;
    icon = (
      <IconContainer
        $color={primaryColor}
        style={{fontSize: compact ? '0.7rem' : undefined}}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </IconContainer>
    );
  } else {
    subtitleText = '';
    icon = null;
  }
  const safeQuery = new RegExp(query.replace(/[^\w\s]/gi, '').trim(), 'gi');
  return (
    <Root style={{gridColumnGap: compact ? 0 : undefined}}>
      {icon}
      <Content style={{fontSize: compact ? '0.8rem' : undefined}}>
        <div
          dangerouslySetInnerHTML={{
            __html: suggestion.name.replace(safeQuery, (match: string) => `<strong>${match}</strong>`),
          }}
        />
        <Subtitle>
          <small>{subtitleText}</small>
        </Subtitle>
      </Content>
    </Root>
  );
};

export default SearchResult;
