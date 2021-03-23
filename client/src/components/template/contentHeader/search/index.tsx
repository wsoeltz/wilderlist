import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import React, {useCallback, useMemo, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import useMapCenter from '../../../../hooks/useMapCenter';
import useMapContext from '../../../../hooks/useMapContext';
import {Routes} from '../../../../routing/routes';
import {
  campsiteDetailLink,
  listDetailLink,
  mountainDetailLink,
  trailDetailLink,
} from '../../../../routing/Utils';
import {
  lightBorderColor,
  tertiaryColor,
} from '../../../../styling/styleUtils';
import {SearchResultType} from '../../../../types/itemTypes';
import {mobileSize} from '../../../../Utils';
import BackButton from '../backButton';
import {getLocalResults, pushToLocalResults, yourLocationDatumId} from './localSuggestions';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import {noResultsFoundClassName, SearchResultDatum} from './Utils';

const Root = styled.div`
  display: flex;

  div.react-autosuggest__container {
    width: 100%;
    position: relative;
    z-index: 500;
  }

  ul.react-autosuggest__suggestions-list {
    position: absolute;
    background-color: #fff;
    border: solid 1px ${lightBorderColor};
    box-shadow: 0px 0px 3px -1px #b5b5b5;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    z-index: 100;
  }

  li.react-autosuggest__suggestion {
    padding: 0.7rem 0.5rem;

    &.react-autosuggest__suggestion--highlighted {
      background-color: ${tertiaryColor};
      cursor: pointer;
    }
  }
  .${noResultsFoundClassName} {
    display: none;
    position: absolute;
    background-color: #fff;
    border: solid 1px ${lightBorderColor};
    box-shadow: 0px 0px 3px -1px #b5b5b5;
    padding: 0.7rem 0.5rem;
    width: 100%;
    box-sizing: border-box;
    z-index: 100;
  }

  @media(max-width: ${mobileSize}px) {
    width: 45px;
    div.react-autosuggest__container {
      position: static;
    }

    input.react-autosuggest__input {
      height: 45px;
      width: 45px;
      border: none;

      &:focus {
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 600;
        position: absolute;
        border: solid 1px ${lightBorderColor};
      }
    }
    ul.react-autosuggest__suggestions-list, .${noResultsFoundClassName} {
        width: 100vw;
        left: 0;
        top: 45px;
        z-index: 600;
    }

  }
`;

const cacheSearchCall: any = setupCache({
  maxAge: 60 * 60 * 1000, // minutes * seconds * milliseconds
});
const getSearchResults = axios.create({
  adapter: cacheSearchCall.adapter,
});

interface SearchState {
  value: string;
  suggestions: SearchResultDatum[];
  loading: boolean;
}

const getSuggestionValue = (suggestion: SearchResultDatum) => suggestion.name;

const renderSuggestion = (suggestion: SearchResultDatum, {query}: {query: string}) =>
  <SearchResult suggestion={suggestion} query={query} />;

const Search = () => {
  const {push, location} = useHistory();
  const center = useMapCenter();
  const mapContext = useMapContext();
  const [state, updateState] = useState<SearchState>({value: '', suggestions: [], loading: false});

  const loadSuggestions = useMemo(
    () => debounce((value: string) => {
      const [lng, lat] = center;
      let favor: string = '';
      if (location.pathname.includes(Routes.SearchMountains)) {
        favor = '&favor=' + SearchResultType.mountain;
      } else if (location.pathname.includes(Routes.SearchTrails)) {
        favor = '&favor=' + SearchResultType.trail;
      } else if (location.pathname.includes(Routes.SearchCampsites)) {
        favor = '&favor=' + SearchResultType.campsite;
      } else if (location.pathname.includes(Routes.SearchLists)) {
        favor = '&favor=' + SearchResultType.list;
      }
      const url = encodeURI(
        '/api/global-search?' +
        '&lat=' + lat.toFixed(3) +
        '&lng=' + lng.toFixed(3) +
        '&search=' + value.replace(/[^\w\s]/gi, '').trim() +
        favor,
      );
      getSearchResults(url).then((res: {data: SearchResultDatum[]}) => {
        const localResults = getLocalResults(value);
        const allResults = uniqBy([...localResults, ...res.data], 'id').slice(0, 7);
        updateState(curr => ({
          ...curr,
          loading: false,
          suggestions: allResults,
        }));
      });
  }, 200), [updateState, center, location]);

  const onChange = useCallback((_event: any, { newValue }: {newValue: string}) => {
    updateState(curr => ({
      ...curr,
      value: newValue,
    }));
  }, [updateState]);

  const onSuggestionsFetchRequested = useCallback(({ value }: { value: string }) => {
    if (value.length > 2) {
      updateState(curr => ({...curr, loading: true}));
      loadSuggestions(value);
    } else {
      const localResults = getLocalResults(value);
      updateState(curr => ({
        ...curr,
        loading: false,
        suggestions: localResults,
      }));
    }
  }, [updateState, loadSuggestions]);

  const onSuggestionsClearRequested = useCallback(() => {
    updateState(curr => ({...curr, suggestions: []}));
  }, [updateState]);

  const onSuggestionSelected = useCallback((_event: any, {suggestion}: {suggestion: SearchResultDatum}) => {
    pushToLocalResults(suggestion);
    const activeElement = document.activeElement;
    if (activeElement) {
      (activeElement as HTMLElement).blur();
    }
    if (mapContext.intialized && (
          window.location.pathname === Routes.CreateList ||
          window.location.pathname.includes('/edit-list/') ||
          window.location.pathname === Routes.AddTripReport ||
          window.location.pathname === Routes.EditTripReport)) {
      mapContext.setNewCenter(suggestion.coordinates, 14);
    } else if (suggestion.type === SearchResultType.mountain) {
      push(mountainDetailLink(suggestion.id));
    } else if (suggestion.type === SearchResultType.list) {
      push(listDetailLink(suggestion.id));
    } else if (suggestion.type === SearchResultType.campsite) {
      push(campsiteDetailLink(suggestion.id));
    } else if (suggestion.type === SearchResultType.trail) {
      push(trailDetailLink(suggestion.id));
    } else if (suggestion.type === SearchResultType.geolocation && mapContext.intialized) {
      if (suggestion.id === yourLocationDatumId) {

        if (navigator.geolocation) {
          updateState(curr => ({...curr, loading: true}));
          navigator.geolocation.getCurrentPosition(position => {
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            mapContext.setNewCenter([longitude, latitude], 12);
            updateState(curr => ({...curr, loading: false}));
          }, error => {
            console.error(error);
            updateState(curr => ({...curr, loading: false}));
          },
          {timeout: 10000});
        }
      } else {
        mapContext.setNewCenter(suggestion.coordinates, 12);
      }
    }
  }, [push, mapContext, updateState]);

  const renderSuggestionsContainer = useCallback(({ containerProps, children, query }: any) => {
    let noResults: React.ReactElement<any> | null;
    if (query.length > 2 && children === null && state.loading === false) {
      noResults = (
        <div className={noResultsFoundClassName}>No results found for <strong>{query}</strong></div>
      );
    } else {
      noResults = null;
    }
    return (
      <div {...containerProps}>
        {children}
        {noResults}
      </div>
    );
  }, [state.loading]);

  let placeholder: string = 'Search Wilderlist';
  if (location.pathname.includes(Routes.SearchMountains)) {
    placeholder = 'Search mountains';
  } else if (location.pathname.includes(Routes.SearchTrails)) {
    placeholder = 'Search trails';
  } else if (location.pathname.includes(Routes.SearchCampsites)) {
    placeholder = 'Search campsites';
  } else if (location.pathname.includes(Routes.SearchLists)) {
    placeholder = 'Search hiking lists';
  }

  const inputProps = useMemo( () => ({
    placeholder,
    value: state.value,
    onChange,
  }), [state, onChange, placeholder]);

  const clearSearch = useCallback(
    () => updateState(curr => ({suggestions: curr.suggestions, value: '', loading: false})),
    [updateState],
  );

  const renderInputComponent = useCallback((inputComponentProps: any) => (
    <SearchInput
      inputProps={inputComponentProps}
      clearSearch={clearSearch}
      loading={state.loading}
      value={state.value}
    />
  ), [state.loading, state.value, clearSearch]);

  return (
    <Root>
      <BackButton
        clearSearch={clearSearch}
      />
      <Autosuggest
        suggestions={state.suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderInputComponent={renderInputComponent}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
        focusInputOnSuggestionClick={false}
        onSuggestionSelected={onSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
        shouldRenderSuggestions={() => true}
      />
    </Root>
  );
};

export default Search;
