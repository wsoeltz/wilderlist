import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useContext, useState} from 'react';
import styled from 'styled-components/macro';
import {
  GhostButton,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
  primaryColor,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';
import { AppContext } from '../../../App';
import LoadingSimple from '../../../sharedComponents/LoadingSimple';
import {noResultsFoundClassName} from './Utils';

const magnifyingGlassSize = 1.5; // in rem
const magnifyingGlassSpacing = 0.5; // in rem

const Input = styled.input`
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

  @media(max-width: ${mobileSize}px) {
    &:not(:focus) {
      color: #fff;
    }
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  z-index: 550;
  top: 0.5rem;
  margin: auto ${magnifyingGlassSpacing}rem;
  font-size: ${magnifyingGlassSize}rem;
  color: ${placeholderColor};
  pointer-events: none;

  @media(max-width: ${mobileSize}px) {
    top: 1.1rem;
    right: 0.65rem;
  }
`;

const ClearButton = styled(GhostButton)`
  position: absolute;
  z-index: 650;
  top: 0.2rem;
  right: 0rem;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;

  @media(max-width: ${mobileSize}px) {
    font-size: 1.6rem;
    top: 0.6rem;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 650;
  top: 0.2rem;
  right: 0rem;

  @media(max-width: ${mobileSize}px) {
    top: 0.6rem;
  }
`;

interface Props {
  inputProps: any;
  clearSearch: () => void;
  loading: boolean;
  value: string;
}

const SearchInput = (props: Props) => {
  const {
    inputProps, clearSearch, loading, value,
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const { windowWidth } = useContext(AppContext);

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
      <LoadingSimple />
    </LoadingContainer>
  ) : (
    <ClearButton
      style={{
        display: (value && windowWidth > mobileSize) || (isFocused && windowWidth <= mobileSize)
          ? undefined : 'none',
      }}
      onClick={clearSearch}
    >
      ×
    </ClearButton>
  );

  return (
    <>
      <SearchIcon
        style={{
          left: isFocused && windowWidth <= mobileSize ? 0 : undefined,
          right: isFocused && windowWidth <= mobileSize ? 'auto' : undefined,
          zIndex: isFocused && windowWidth <= mobileSize ? 620 : undefined,
          color: !isFocused && windowWidth <= mobileSize ? primaryColor : undefined,
        }}
        icon='search'
      />
      {clearContent}
      <Input
        {...inputProps}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={isFocused || windowWidth > mobileSize ? inputProps.placeholder : ''}
      />
    </>
  );
};

export default SearchInput;
