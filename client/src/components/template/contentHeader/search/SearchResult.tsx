import {
  faCrosshairs,
  faHistory,
  faList,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {rgba} from 'polished';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../../hooks/useFluent';
import {
  historyColor,
  lightBaseColor,
  primaryColor,
} from '../../../../styling/styleUtils';
import {SearchResultType} from '../../../../types/itemTypes';
import {
  mountainNeutralSvg,
  tentNeutralSvg,
  trailDefaultSvg,
} from '../../../sharedComponents/svgIcons';
import {yourLocationDatumId} from './localSuggestions';
import {SearchResultDatum} from './Utils';

const StandardRoot = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
`;

const LocalRoot = styled(StandardRoot)`
  color: ${historyColor};
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

const StandardIconContainer = styled.div`
  margin-right: 0.25rem;
  margin-top: 0.1em;
  font-size: 0.85em;
  color: ${primaryColor};
  background-color: ${rgba(lightBaseColor, 0.2)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 1000px;

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

const LocalIconContainer = styled(StandardIconContainer)`
  color: ${historyColor};
  background-color: transparent;

  svg {
    .fill-path {
      fill: ${historyColor};
    }
  }
`;

const YourLocationIconContainer = styled(StandardIconContainer)`
  color: ${primaryColor};
  background-color: ${rgba(primaryColor, 0.25)};
`;

interface Props {
  query: string;
  suggestion: SearchResultDatum;
}

const SearchResult = ({query, suggestion}: Props) => {
  const getString = useFluent();

  const IconContainer = suggestion.history && query.length < 3
    ? LocalIconContainer : StandardIconContainer;
  let subtitleText: string;
  let icon: React.ReactElement<any> | null;
  if (suggestion.type === SearchResultType.mountain) {
    subtitleText = suggestion.locationText
      ? `${suggestion.elevation}ft | ${suggestion.locationText}` : `${suggestion.elevation}ft`;
    icon = (
      <IconContainer
        dangerouslySetInnerHTML={{__html: mountainNeutralSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.trail) {
    const trailType = getString('global-formatted-trail-type', {type: suggestion.trailType});
    const segment = suggestion.parents.length ? ' segment ' : '';
    const trailLength = suggestion.trailLength;
    const trailLengthDisplay = trailLength < 0.1
      ? Math.round(trailLength * 5280) + ' ft'
      : parseFloat(trailLength.toFixed(1)) + ' mi';
    subtitleText = suggestion.locationText
      ? `${trailLengthDisplay} long ${trailType}${segment} in ${suggestion.locationText}`
      : trailType.charAt(0).toUpperCase() + trailType.slice(1).replaceAll('_', ' ');
    icon = (
      <IconContainer
        dangerouslySetInnerHTML={{__html: trailDefaultSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.campsite) {
    const campsiteType = getString('global-formatted-campsite-type', {type: suggestion.campsiteType});
    subtitleText = suggestion.locationText
      ? `${campsiteType.charAt(0).toUpperCase() + campsiteType.slice(1).replaceAll('_', ' ')} in ${suggestion.locationText}`
      : campsiteType.charAt(0).toUpperCase() + campsiteType.slice(1).replaceAll('_', ' ');
    icon = (
      <IconContainer
        dangerouslySetInnerHTML={{__html: tentNeutralSvg}}
      />
    );
  } else if (suggestion.type === SearchResultType.list) {
    subtitleText = suggestion.locationText
      ? `${suggestion.numPeaks} peaks in ${suggestion.locationText}` : `${suggestion.numPeaks} peaks`;
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
  if (suggestion.history && query.length < 3) {
    icon = (
      <IconContainer>
        <FontAwesomeIcon icon={faHistory} />
      </IconContainer>
    );
  }
  if (suggestion.id === yourLocationDatumId) {
    icon = (
      <YourLocationIconContainer>
        <FontAwesomeIcon icon={faCrosshairs} />
      </YourLocationIconContainer>
    );
  }
  const Root = suggestion.history && query.length < 3
    ? LocalRoot
    : StandardRoot;
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
