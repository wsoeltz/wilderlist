import { useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import { sortBy } from 'lodash';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import { State } from '../../../types/graphQLTypes';
import {
  Button,
  DropdownWrapper,
  HorizontalRule,
  ListItem,
  LoadingSpinnerWrapper,
  Root,
} from '../../peakLists/list/LocationFilter';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';

const GET_STATES_WITH_MOUNTAINS = gql`
  query {
    states {
      id
      name
      abbreviation
      numMountains
    }
  }
`;

interface SuccessResponse {
  states: null | Array<{
    id: State['id'];
    name: State['name'];
    numMountains: State['numMountains'];
  }>;
}

interface Props {
  children: JSX.Element;
  changeLocation: (name: string) => void;
  setSelectedState: (stateId: State['id'] | null) => void;
}

const LocationFilter = (props: Props) => {
  const { children, changeLocation, setSelectedState } = props;

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

  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES_WITH_MOUNTAINS);

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
        if (state.numMountains) {
          const onClick = () => {
            setIsMenuOpen(false);
            changeLocation(state.name);
            setSelectedState(state.id);
          };
          return (
            <ListItem
              onClick={onClick}
              tabIndex={0}
              key={state.id}
            >
              {state.name} ({state.numMountains})
            </ListItem>
          );
        } else {
          return null;
        }
      }) : null;
      const everyWhereOnClick = () => {
        setIsMenuOpen(false);
        changeLocation(getFluentString('global-text-value-everywhere'));
        setSelectedState(null);
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
