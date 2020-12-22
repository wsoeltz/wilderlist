import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'lodash/debounce';
import React, {useCallback, useMemo, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import styled from 'styled-components/macro';
import {
  GhostButton,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
  tertiaryColor,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';

const magnifyingGlassSize = 1.5; // in rem
const magnifyingGlassSpacing = 0.5; // in rem

const Root = styled.div`
  div.react-autosuggest__container {
    width: 100%;
    position: relative;
  }

  input {
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
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
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
  top: 1.2rem;
  right: 1rem;
`;

const languages = [
  {
    name: 'C',
    year: 1972,
  },
  {
    name: 'C#',
    year: 2000,
  },
  {
    name: 'C++',
    year: 1983,
  },
  {
    name: 'Clojure',
    year: 2007,
  },
  {
    name: 'Elm',
    year: 2012,
  },
  {
    name: 'Go',
    year: 2009,
  },
  {
    name: 'Haskell',
    year: 1990,
  },
  {
    name: 'Java',
    year: 1995,
  },
  {
    name: 'Javascript',
    year: 1995,
  },
  {
    name: 'Perl',
    year: 1987,
  },
  {
    name: 'PHP',
    year: 1995,
  },
  {
    name: 'Python',
    year: 1991,
  },
  {
    name: 'Ruby',
    year: 1995,
  },
  {
    name: 'Scala',
    year: 2003,
  },
];
function escapeRegexCharacters(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function getMatchingLanguages(value: string) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

interface SearchState {
  value: string;
  suggestions: any[];
  loading: boolean;
}

function getSuggestionValue(suggestion: any) {
  return suggestion.name;
}

function renderSuggestion(suggestion: any) {
  return (
    <>{suggestion.name}</>
  );
}

const Search = () => {
  const [state, updateState] = useState<SearchState>({value: '', suggestions: [], loading: false});

  const loadSuggestions = useMemo(
    () => debounce((value: string) => {
      setTimeout(() => { // fake api call
        updateState(curr => ({
          ...curr,
          loading: false,
          suggestions: getMatchingLanguages(value),
        }));
      }, 200);
  }, 350), [updateState]);

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

  const clearSearch = () => updateState(curr => ({...curr, suggestions: [], value: ''}));

  const inputProps = {
    placeholder: 'Search Wilderlist',
    value: state.value,
    onChange,
  };

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
      />
      {clearContent}
      <SearchIcon icon='search' />
    </Root>
  );
};

export default Search;
