import {
  faList,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import useFluent from '../../../hooks/useFluent';
import {
  primaryColor,
} from '../../../styling/styleUtils';
import {
  mountainNeutralSvg,
  tentNeutralSvg,
  trailDefaultSvg,
} from '../svgIcons';
import {SearchResultDatum, SearchResultType} from './Utils';

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

const IconContainer = styled.div`
  margin-right: 0.25rem;
  margin-top: 0.1em;
  font-size: 0.85em;
  color: ${primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem;

    .fill-path {
      fill: ${primaryColor};
    }
    .stroke-path {
      fill: #fff;
    }
  }
`;

interface Props {
  query: string;
  suggestion: SearchResultDatum;
}

const SearchResult = ({query, suggestion}: Props) => {
  const getString = useFluent();

  let subtitleText: string;
  let icon: React.ReactElement<any> | null;
  if (suggestion.type === SearchResultType.mountain) {
    subtitleText = suggestion.stateText[0]
      ? `${suggestion.stateText[0]}, ${suggestion.elevation}ft` : `${suggestion.elevation}ft`;
    icon = (
      <IconContainer
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
        dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.list) {
    const states = suggestion.stateText.join(', ');
    subtitleText = states.length ? `${suggestion.numPeaks} peaks in ${states}` : `${suggestion.numPeaks} peaks`;
    icon = (
      <IconContainer>
        <FontAwesomeIcon icon={faList} />
      </IconContainer>
    );
  } else if (suggestion.type === SearchResultType.geolocation) {
    subtitleText = suggestion.locationName;
    icon = (
      <IconContainer>
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </IconContainer>
    );
  } else {
    subtitleText = '';
    icon = null;
  }
  const safeQuery = new RegExp(query.replace(/[^\w\s]/gi, '').trim(), 'gi');
  return (
    <Root>
      {icon}
      <Content>
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
