import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import debounce from 'lodash/debounce';
import React, {useCallback, useMemo, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import {listDetailLink, mountainDetailLink} from '../../../../routing/Utils';
import {
  GhostButton,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
  tertiaryColor,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';
import SearchResult from './SearchResult';
import {SearchResultDatum, SearchResultType} from './Utils';

const magnifyingGlassSize = 1.5; // in rem
const magnifyingGlassSpacing = 0.5; // in rem

const noResultsFoundClassName = 'react-autosuggest__no_results_found';

const Root = styled.div`
  div.react-autosuggest__container {
    width: 100%;
    position: relative;
    z-index: 500;
  }

  input.react-autosuggest__input {
    width: 100%;
    padding: 8px 8px 8px ${magnifyingGlassSize + (magnifyingGlassSpacing * 2)}rem;
    box-sizing: border-box;
    border: solid 1px ${lightBorderColor};
    box-shadow: 0px 0px 3px -1px #b5b5b5;
    font-size: 1.2rem;
    font-weight: ${lightFontWeight};

    &::placeholder {
      color: ${placeholderColor};
    }

    &.react-autosuggest__input--focused
    + .react-autosuggest__suggestions-container
    .${noResultsFoundClassName} {
      display: block;
    }
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
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  z-index: 550;
  top: 1.5rem;
  margin: auto ${magnifyingGlassSpacing}rem;
  font-size: ${magnifyingGlassSize}rem;
  color: ${placeholderColor};
  pointer-events: none;

  @media(max-width: ${mobileSize}px) {
    top: 1.65rem;
  }
`;

const ClearButton = styled(GhostButton)`
  position: absolute;
  z-index: 550;
  top: 1.2rem;
  right: 1rem;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;

  @media(max-width: ${mobileSize}px) {
    top: 1.4rem;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 550;
  top: 1.2rem;
  right: 1rem;
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

function getSuggestionValue(suggestion: SearchResultDatum) {
  return suggestion.name;
}

const renderSuggestion = (suggestion: SearchResultDatum, {query}: {query: string}) =>
  <SearchResult suggestion={suggestion} query={query} />;

const Search = () => {
  const {push} = useHistory();
  const [state, updateState] = useState<SearchState>({value: '', suggestions: [], loading: false});

  const loadSuggestions = useMemo(
    () => debounce((value: string) => {
      const url = encodeURI(
        '/api/global-search?' +
        '&lat=' + 41.478050 +
        '&lng=' + -71.475360 +
        '&search=' + value.replace(/[^\w\s]/gi, '').trim(),
      );
      getSearchResults(url).then((res: {data: SearchResultDatum[]}) => {
        updateState(curr => ({
          ...curr,
          loading: false,
          suggestions: res.data,
        }));
      });
  }, 300), [updateState]);

  const onChange = useCallback((_event: any, { newValue }: {newValue: string}) => {
    updateState(curr => ({...curr, value: newValue}));
  }, [updateState]);

  const onSuggestionsFetchRequested = useCallback(({ value }: { value: string }) => {
    if (value.length > 2) {
      updateState(curr => ({...curr, loading: true}));
      loadSuggestions(value);
    }
  }, [updateState, loadSuggestions]);

  const onSuggestionsClearRequested = useCallback(() => {
    updateState(curr => ({...curr, suggestions: []}));
  }, [updateState]);

  const clearSearch = useCallback(
    () => updateState(curr => ({...curr, suggestions: [], value: ''})),
    [updateState],
  );

  const onSuggestionSelected = useCallback((_event: any, {suggestion}: {suggestion: SearchResultDatum}) => {
    const activeElement = document.activeElement;
    if (activeElement) {
      (activeElement as HTMLElement).blur();
    }
    if (suggestion.type === SearchResultType.mountain) {
      push(mountainDetailLink(suggestion.id));
    } else if (suggestion.type === SearchResultType.list) {
      push(listDetailLink(suggestion.id));
    }
  }, [push]);

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

  const inputProps = useMemo( () => ({
    placeholder: 'Search Wilderlist',
    value: state.value,
    onChange,
  }), [state, onChange]);

  const clearContent = state.loading ? (
    <LoadingContainer>
      <LoadingSimple />
    </LoadingContainer>
  ) : (
    <ClearButton
      style={{
        display: state.value ? undefined : 'none',
      }}
      onClick={clearSearch}
    >
      ×
    </ClearButton>
  );

  return (
    <Root>
      <Autosuggest
        suggestions={state.suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
        focusInputOnSuggestionClick={false}
        onSuggestionSelected={onSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
      />
      {clearContent}
      <SearchIcon icon='search' />
    </Root>
  );
};

export default Search;
