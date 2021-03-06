import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components/macro';
import useWindowWidth from '../../../../hooks/useWindowWidth';
import {Routes} from '../../../../routing/routes';
import {
  GhostButton,
  lightBorderColor,
  lightFontWeight,
  placeholderColor,
  primaryColor,
} from '../../../../styling/styleUtils';
import {mobileSize} from '../../../../Utils';
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
    top: 0.85rem;
    right: 0.3rem;
  }
`;

const ClearButton = styled(GhostButton)`
  position: absolute;
  z-index: 650;
  top: 0.2rem;
  right: 0;
  padding: 1rem;
  line-height: 0;
  font-size: 1.2rem;

  @media(max-width: ${mobileSize}px) {
    font-size: 1.6rem;
    top: 0.4rem;
  }

  @media(max-width: 450px) {
    top: 0.6rem;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 650;
  top: 0.2rem;
  right: 0;

  @media(max-width: ${mobileSize}px) {
    top: 0.4rem;
    background-color: #fff;
  }

  @media(max-width: 450px) {
    top: 0.6rem;
    right: 0;
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

  const windowWidth = useWindowWidth();
  const { push, location: {pathname} } = useHistory();

  const onFocus = (event: any) => {
    clearSearch();
    setTimeout(() => {
      inputProps.onFocus(event);
      setIsFocused(true);
    }, 0);
  };

  const onBlur = (event: any) => {
    inputProps.onBlur(event);
    setIsFocused(false);
  };

  const onClear = useCallback(() => {
    clearSearch();
    if (windowWidth > mobileSize) {
      push(Routes.Landing);
    }
  }, [windowWidth, push, clearSearch]);

  const clearContent = loading ? (
    <LoadingContainer>
      <LoadingSimple />
    </LoadingContainer>
  ) : (
    <ClearButton
      style={{
        display: ((value || pathname !== Routes.Landing) && windowWidth > mobileSize) ||
                 (isFocused && windowWidth <= mobileSize)
          ? undefined : 'none',
      }}
      onClick={onClear}
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
