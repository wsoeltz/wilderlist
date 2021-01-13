import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import debounce from 'lodash/debounce';
import React, {useCallback, useMemo, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import styled from 'styled-components/macro';
import useMapCenter from '../../../hooks/useMapCenter';
import {
  lightBorderColor,
  tertiaryColor,
} from '../../../styling/styleUtils';
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

interface Props {
  endpoint: string;
  ignore: string[];
  onSelect: (datum: SearchResultDatum) => void;
}

const Search = (props: Props) => {
  const {endpoint, ignore, onSelect} = props;
  const center = useMapCenter();
  const [state, updateState] = useState<SearchState>({value: '', suggestions: [], loading: false});

  const loadSuggestions = useMemo(
    () => debounce((value: string) => {
      const [lng, lat] = center;
      getSearchResults({
          method: 'post',
          url: endpoint,
          data: {
            lat: lat.toFixed(3),
            lng: lng.toFixed(3),
            search: value.replace(/[^\w\s]/gi, '').trim(),
            ignore,
          },
        }).then((res: {data: SearchResultDatum[]}) => {
        updateState(curr => ({
          ...curr,
          loading: false,
          suggestions: res.data,
        }));
      });
  }, 100), [updateState, center, endpoint, ignore]);

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

  const onSuggestionSelected = useCallback((_event: any, {suggestion}: {suggestion: SearchResultDatum}) => {
    const activeElement = document.activeElement;
    if (activeElement) {
      (activeElement as HTMLElement).blur();
    }
    onSelect(suggestion);
  }, [onSelect]);

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

  const clearSearch = useCallback(
    () => updateState({suggestions: [], value: '', loading: false}),
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
      />
    </Root>
  );
};

export default Search;
