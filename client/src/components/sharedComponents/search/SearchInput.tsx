import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import {
  GhostButton,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
} from '../../../styling/styleUtils';
import {mobileSize} from '../../../Utils';
import LoadingSimple from '../../sharedComponents/LoadingSimple';
import {noResultsFoundClassName} from './Utils';

const magnifyingGlassSize = 1.5; // in rem
const magnifyingGlassSpacing = 0.5; // in rem

const Input = styled.input`
  width: 100%;
  padding: 8px 8px 8px ${magnifyingGlassSize + (magnifyingGlassSpacing * 2)}rem;
  box-sizing: border-box;
  border: solid 1px ${lightBorderColor};
  font-size: 1rem;
  font-weight: ${lightFontWeight};

  &::placeholder {
    color: ${placeholderColor};
  }

  &.react-autosuggest__input--focused
  + .react-autosuggest__suggestions-container
  .${noResultsFoundClassName} {
    display: block;
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 0.5rem;
  margin: auto ${magnifyingGlassSpacing}rem;
  font-size: ${magnifyingGlassSize}rem;
  color: ${placeholderColor};
  pointer-events: none;

  @media(max-width: ${mobileSize}px) {
    top: 0.65rem;
  }
`;

const ClearButton = styled(GhostButton)`
  position: absolute;
  z-index: 650;
  top: 0.3rem;
  right: 0;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;

  @media(max-width: ${mobileSize}px) {
    font-size: 1.6rem;
  }

  @media(max-width: 450px) {
    top: 0.5rem;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 650;
  top: 0.2rem;
  right: 0;

  @media(max-width: 450px) {
    top: 0.9rem;
  }
`;

interface Props {
  inputProps: any;
  clearSearch: () => void;
  loading: boolean;
  value: string;
  hideIcon: boolean | undefined;
  compact: boolean | undefined;
}

const SearchInput = (props: Props) => {
  const {
    inputProps, clearSearch, loading, value, hideIcon, compact,
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (event: any) => {
    inputProps.onFocus(event);
    setIsFocused(true);
    clearSearch();
  };

  const onBlur = (event: any) => {
    inputProps.onBlur(event);
    setIsFocused(false);
  };

  const clearContent = loading ? (
    <LoadingContainer>
      <LoadingSimple
        size={compact ? 20 : undefined}
      />
    </LoadingContainer>
  ) : (
    <ClearButton
      style={{
        display: value || isFocused ? undefined : 'none',
        fontSize: compact ? 1 + 'rem' : undefined,
        padding: compact ? '0.6rem 0.3rem' : undefined,
      }}
      onClick={clearSearch}
    >
      ×
    </ClearButton>
  );

  const searchIcon = hideIcon ? null : (
    <SearchIcon
      icon='search'
      style={{
        fontSize: compact ? magnifyingGlassSize * 0.5 + 'rem' : undefined,
      }}
    />
  );
  const style = compact ? {
    padding: hideIcon
      ? 6 : `6px 6px 6px ${(magnifyingGlassSize * 0.5) + magnifyingGlassSpacing * 1.5}rem`,
    fontSize: '0.85rem',
  } : {
    paddingLeft: hideIcon ? 8 : undefined,
  };

  return (
    <>
      {searchIcon}
      {clearContent}
      <Input
        {...inputProps}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={inputProps.placeholder}
        style={style}
      />
    </>
  );
};

export default SearchInput;
