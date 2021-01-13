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

interface Props {
  endpoint: string;
  ignore: string[];
  onSelect: (datum: SearchResultDatum) => boolean | void;
  placeholder: string;
  hideIcon?: boolean;
  keepFocusOnSelect?: boolean;
  compact?: boolean;
}

const Search = (props: Props) => {
  const {endpoint, ignore, onSelect, hideIcon, keepFocusOnSelect, compact, placeholder} = props;
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
  }, 200), [updateState, center, endpoint, ignore]);

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
    () => updateState({suggestions: [], value: '', loading: false}),
    [updateState],
  );

  const onSuggestionSelected = useCallback((_event: any, {suggestion}: {suggestion: SearchResultDatum}) => {
    const activeElement = document.activeElement;
    if (activeElement && !keepFocusOnSelect) {
      (activeElement as HTMLElement).blur();
    }
    const shouldClearSearch = onSelect(suggestion);
    if (shouldClearSearch) {
      clearSearch();
    }
  }, [onSelect, clearSearch, keepFocusOnSelect]);

  const renderSuggestionsContainer = useCallback(({ containerProps, children, query }: any) => {
    let noResults: React.ReactElement<any> | null;
    if (query.length > 2 && children === null && state.loading === false) {
      noResults = (
        <div
          className={noResultsFoundClassName}
          style={{fontSize: compact ? '0.8rem' : undefined}}
        >
          No results found for <strong>{query}</strong>
        </div>
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
  }, [state.loading, compact]);

  const inputProps = useMemo( () => ({
    placeholder,
    value: state.value,
    onChange,
  }), [state, onChange, placeholder]);

  const renderInputComponent = useCallback((inputComponentProps: any) => (
    <SearchInput
      inputProps={inputComponentProps}
      clearSearch={clearSearch}
      loading={state.loading}
      value={state.value}
      hideIcon={hideIcon}
      compact={compact}
    />
  ), [state.loading, state.value, clearSearch, hideIcon, compact]);

  const renderSuggestionCallback = useCallback((suggestion: SearchResultDatum, {query}: {query: string}) =>
    <SearchResult suggestion={suggestion} query={query} compact={compact} />, [compact]);

  return (
    <Root>
      <Autosuggest
        suggestions={state.suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderInputComponent={renderInputComponent}
        renderSuggestion={renderSuggestionCallback}
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
