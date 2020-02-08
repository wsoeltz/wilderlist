import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import { sortBy } from 'lodash';
import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ButtonTertiary,
  lightBorderColor,
  PlaceholderText,
  tertiaryColor,
} from '../../../styling/styleUtils';
import { PeakList, State } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';

export const Root = styled.div`
  position: relative;
  height: 100%;
`;

export const Button = styled.div`
  height: 100%;
`;

export const LoadingSpinnerWrapper = styled.div`
  padding: 1rem;
`;

export const DropdownWrapper = styled.div`
  position: absolute;
  top: 100%;
  width: 200px;
  background-color: ${tertiaryColor};
  z-index: 100;
  border: 1px solid ${lightBorderColor};
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
`;

export const ListItem = styled(ButtonTertiary)`
  width: 100%;
  text-align: left;
  border-radius: 0;
  background-color: transparent;
  padding: 0.5rem;
`;

export const HorizontalRule = styled.hr`
  background-color: ${lightBorderColor};
  height: 1px;
  border: none;
  margin: 0 0.5rem;
`;

const GET_STATES_WITH_LISTS = gql`
  query {
    states {
      id
      name
      abbreviation
      peakLists {
        id
        children {
          id
        }
      }
    }
  }
`;

interface SuccessResponse {
  states: null | Array<{
    id: State['id'];
    name: State['name'];
    peakLists: Array<{
      id: PeakList['id'];
      children: null | Array<{
        id: PeakList['id'];
      }>;
    }>
  }>;
}

interface Props {
  children: JSX.Element;
  changeLocation: (name: string) => void;
  setSelectionArray: (array: Array<PeakList['id']> | null) => void;
}

const LocationFilter = (props: Props) => {
  const { children, changeLocation, setSelectionArray } = props;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const locationButtonEl = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (locationButtonEl.current !== null) {
      const el = locationButtonEl.current;
      const preventClickFromPropagating = (e: MouseEvent) => {
        e.stopPropagation();
      };
      el.addEventListener('mousedown', preventClickFromPropagating);
      return () => el.removeEventListener('mousedown', preventClickFromPropagating);
    }
  }, [locationButtonEl]);

  const menuNode = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const element = e.target as HTMLElement;
      if (!(menuNode !== null && menuNode.current !== null && menuNode.current.contains(element))) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES_WITH_LISTS);

  let dropdown: React.ReactElement<any> | null;
  if (isMenuOpen === true) {
    if (loading === true) {
      dropdown = (
        <DropdownWrapper>
          <LoadingSpinnerWrapper>
            <LoadingSpinner />
          </LoadingSpinnerWrapper>
        </DropdownWrapper>
      );
    } else if (error !== undefined) {
      console.error(error);
      dropdown =  (
        <DropdownWrapper>
          <PlaceholderText>
            {getFluentString('global-error-retrieving-data')}
          </PlaceholderText>
        </DropdownWrapper>
      );
    } else if (data !== undefined) {
      const { states } = data;
      const sortedStates = states ? sortBy(states, ['name']) : null;
      const stateList = sortedStates ? sortedStates.map(state => {
        const allListsForState: Array<PeakList['id']> = [];
        if (state.peakLists && state.peakLists.length) {
          state.peakLists.forEach(list => {
            allListsForState.push(list.id);
            if (list.children && list.children.length) {
              list.children.forEach(childList => allListsForState.push(childList.id));
            }
          });
          const onClick = () => {
            setIsMenuOpen(false);
            changeLocation(state.name);
            setSelectionArray(allListsForState);
          };
          return (
            <ListItem
              onClick={onClick}
              tabIndex={0}
              key={state.id}
            >
              {state.name} ({allListsForState.length})
            </ListItem>
          );
        } else {
          return null;
        }
      }) : null;
      const everyWhereOnClick = () => {
        setIsMenuOpen(false);
        changeLocation(getFluentString('global-text-value-everywhere'));
        setSelectionArray(null);
      };
      dropdown = (
        <DropdownWrapper ref={menuNode}>
          <ListItem onClick={everyWhereOnClick} tabIndex={0}>
            {getFluentString('global-text-value-everywhere')}
          </ListItem>
          <HorizontalRule />
          {stateList}
        </DropdownWrapper>
      );
    } else {
      dropdown = null;
    }
  } else {
    dropdown = null;
  }

  return (
    <Root ref={locationButtonEl}>
      <Button onClick={() => setIsMenuOpen(!isMenuOpen)} tabIndex={0}>
        {children}
      </Button>
      {dropdown}
    </Root>
  );
};

export default LocationFilter;
