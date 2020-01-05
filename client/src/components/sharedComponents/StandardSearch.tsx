import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import {
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
} from '../../styling/styleUtils';

const SearchContainer = styled.label`
  position: relative;
  display: flex;
`;

const magnifyingGlassSize = 1.5; // in rem
const magnifyingGlassSpacing = 0.5; // in rem

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto ${magnifyingGlassSpacing}rem;
  font-size: ${magnifyingGlassSize}rem;
  color: ${placeholderColor};
  cursor: pointer;
`;

const SearchBar = styled.input`
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
`;

interface Props {
  placeholder: string;
  setSearchQuery: (value: string) => void;
  initialQuery: string;
  focusOnMount: boolean;
}

const StandardSearch = (props: Props) => {
  const { placeholder, setSearchQuery, initialQuery, focusOnMount } = props;

  const searchEl = useRef<HTMLInputElement | null>(null);

  const onChange = debounce(() => {
    if (searchEl !== null && searchEl.current !== null) {
      setSearchQuery(searchEl.current.value);
    }
  }, 400);

  useEffect(() => {
    const node = searchEl.current;
    if (node) {
      if (focusOnMount === true) {
        node.focus();
      }
      node.value = initialQuery;
    }
  }, [searchEl, focusOnMount, initialQuery]);

  return (
    <SearchContainer>
      <SearchIcon icon='search' />
      <SearchBar
        ref={searchEl}
        type='text'
        placeholder={placeholder}
        onChange={onChange}
      />
    </SearchContainer>
  );
};

export default StandardSearch;
