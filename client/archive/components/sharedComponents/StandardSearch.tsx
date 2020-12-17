import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import {
  GhostButton,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
} from '../../styling/styleUtils';
import { AppContext } from '../App';

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

const ClearButton = styled(GhostButton)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;
`;

interface Props {
  placeholder: string;
  setSearchQuery: (value: string) => void;
  initialQuery: string;
  focusOnMount: boolean;
  type?: string;
  noSearchIcon?: boolean;
}

const StandardSearch = (props: Props) => {
  const { placeholder, setSearchQuery, initialQuery, focusOnMount, noSearchIcon, type } = props;

  const searchEl = useRef<HTMLInputElement | null>(null);
  const clearEl = useRef<HTMLButtonElement | null>(null);
  const { windowWidth } = useContext(AppContext);

  const onChange = debounce(() => {
    if (searchEl !== null && searchEl.current !== null) {
      setSearchQuery(searchEl.current.value);
      if (clearEl && clearEl.current) {
        clearEl.current.style.display = searchEl.current.value.length ? 'block' : 'none';
      }
    }
  }, 400);

  const clearSearch = () => {
    if (searchEl !== null && searchEl.current !== null) {
      searchEl.current.value = '';
      setSearchQuery(searchEl.current.value);
    }
    if (clearEl && clearEl.current) {
      clearEl.current.style.display = 'none';
    }
  };

  useEffect(() => {
    const node = searchEl.current;
    if (node) {
      if (focusOnMount === true && windowWidth > 1024) {
        node.focus();
      }
      if (!node.value) {
        node.value = initialQuery;
      }
      if (clearEl && clearEl.current) {
        clearEl.current.style.display = node.value.length ? 'block' : 'none';
      }
    }
  }, [searchEl, focusOnMount, windowWidth, initialQuery]);

  const searchIcon = noSearchIcon ? null : <SearchIcon icon='search' />;

  return (
    <SearchContainer>
      {searchIcon}
      <SearchBar
        ref={searchEl}
        type={type ? type : 'text'}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={'off'}
        style={{padding: noSearchIcon ? '0.4rem' : undefined}}
      />
      <ClearButton
        ref={clearEl}
        style={{
          display: 'none',
          marginRight: type === 'number' ? '1rem' : undefined,
        }}
        onClick={clearSearch}
      >
        ×
      </ClearButton>
    </SearchContainer>
  );
};

export default StandardSearch;
