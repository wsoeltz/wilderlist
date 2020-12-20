import { gql, useQuery } from '@apollo/client';
import { faMountain } from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import styled from 'styled-components';
import useFluent from '../../../../../hooks/useFluent';
import usePrevious from '../../../../../hooks/usePrevious';
import {
  BasicIconInText,
  ButtonPrimary,
  DetailBox,
  DetailBoxTitle,
  lightBaseColor,
  lightBlue,
  lightBorderColor,
  tertiaryColor,
} from '../../../../../styling/styleUtils';
import {getDistanceFromLatLonInMiles} from '../../../../../Utils';
import Modal from '../../../../sharedComponents/Modal';
import StandardSearch from '../../../../sharedComponents/StandardSearch';
import {ModalButtonWrapper} from '../Utils';
import {MountainDatum} from './AddMountains';

const mobileWidth = 550; // in px

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-gap: 1rem;
  height: 100%;

  @media (max-width: ${mobileWidth}px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto 350px;
    height: auto;
  }
`;

const SelectedMountainsRoot = styled.div`
  grid-column: 1 / -1;
  grid-row: 1;
`;

const SearchPanel = styled.div`
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
`;

const SelectedMountainsDetails = styled(DetailBox)`
  display: flex;
  flex-wrap: wrap;
`;

const MountainItem = styled.div`
  display: block;
  position: relative;
  padding: 0.5rem;
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  &:not(:last-child) {
    border-bottom: 1px solid ${lightBorderColor};
  }

  &:hover {
    cursor: pointer;
    background-color: ${lightBlue};
  }

  &:after {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0.4rem;
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    color: ${lightBaseColor};
  }
`;

const MountainItemAdd = styled(MountainItem)`
  &:after {
    content: '+';
  }
`;
const MountainItemRemove = styled.div`
  flex-shrink: 0;
  white-space: nowrap;
  background-color: ${lightBlue};
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  margin: 0.4rem 0.8rem 0.4rem 0;

  &:hover {
    cursor: pointer;
  }

  &:after {
    margin-left: 1rem;
    content: '×';
  }
`;

const Subtitle = styled.small`
  color: ${lightBaseColor};
`;

const SearchResults = styled.div`
  flex-grow: 1;
  background-color: ${tertiaryColor};
  border: solid 1px ${lightBorderColor};
  border-top: none;
  height: 250px;
  overflow: auto;
`;

const SEARCH_MOUNTAINS = gql`
  query SearchMountains(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!
  ) {
    mountains: mountainSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      state {
        id
        abbreviation
      }
      elevation
      latitude
      longitude
    }
  }
`;

interface SuccessResponse {
  mountains: MountainDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

interface Props {
  initialSelectedMountains: MountainDatum[];
  closeAndAddMountains: (mountains: MountainDatum[]) => void;
}

const MountainSelector = (props: Props) => {
  const {
    initialSelectedMountains, closeAndAddMountains,
  } = props;

  const getString = useFluent();

  const [selectedMountains, setSelectedMountains] = useState<MountainDatum[]>(initialSelectedMountains);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pageNumber = 1;
  const nPerPage = 30;

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_MOUNTAINS, {
    variables: { searchQuery, pageNumber, nPerPage },
  });

  const prevData = usePrevious(data);

  let dataToUse: SuccessResponse | undefined;
  if (data !== undefined) {
    dataToUse = data;
  } else if (prevData !== undefined) {
    dataToUse = prevData;
  } else {
    dataToUse = undefined;
  }

  const addMountainToList = (newMtn: MountainDatum) => {
    if (!selectedMountains.find(mtn => mtn.id === newMtn.id)) {
      setSelectedMountains([...selectedMountains, newMtn]);
    }
  };

  const removeMountainFromList = (mtnToRemove: MountainDatum) => {
    const updatedMtnList = selectedMountains.filter(mtn => mtn.id !== mtnToRemove.id);
    setSelectedMountains([...updatedMtnList]);
  };

  let searchResults: React.ReactElement<any> | null;
  const targetMountain = selectedMountains.length && selectedMountains[0]
    ? selectedMountains[0] : null;
  const selectedMountainList = selectedMountains.map(mtn => (
    <MountainItemRemove
      onClick={() => removeMountainFromList(mtn)}
      badProp={false}
      key={mtn.id}
    >
      {mtn.name}
    </MountainItemRemove>
  ));

  if (dataToUse !== undefined ) {
    const { mountains } = dataToUse;
    const mountainList: Array<React.ReactElement<any>> = [];
    if (mountains && mountains.length) {
      mountains.forEach(mtn => {
        if (!selectedMountains.find(m => m.id === mtn.id)) {
          const distance = targetMountain && targetMountain.id !== mtn.id
            ? ' | ' + parseFloat(getDistanceFromLatLonInMiles({
              lat1: targetMountain.latitude,
              lon1: targetMountain.longitude,
              lat2: mtn.latitude,
              lon2: mtn.longitude,
            }).toFixed(2)) + ' mi from ' + targetMountain.name : '';
          mountainList.push(
            <MountainItemAdd
              onClick={() => addMountainToList(mtn)}
              key={mtn.id}
            >
              {mtn.name}
              <Subtitle>
                {mtn.state ? mtn.state.abbreviation + ' | ' : ''}
                {mtn.elevation + 'ft' }
                {distance}
              </Subtitle>
            </MountainItemAdd>,
          );
        } else {
          return null;
        }
      });
      searchResults = (
        <>{mountainList}</>
      );
    } else {
      if (loading === false) {
        searchResults = (
          <p style={{textAlign: 'center'}}>
            <small
              dangerouslySetInnerHTML={{
                __html: getString('global-text-value-no-results-found-for-term', {term: searchQuery}),
              }} />
          </p>
        );
      } else {
        searchResults = null;
      }
    }
  } else if (loading === true) {
    searchResults = null;
  } else if (error !== undefined) {
    console.error(error);
    searchResults = null;
  } else {
    searchResults = null;
  }

  const onClose = () => {
    closeAndAddMountains(selectedMountains);
  };

  const actions = (
    <ModalButtonWrapper>
      <ButtonPrimary onClick={onClose} mobileExtend={true}>
        Done Updating Mountains
      </ButtonPrimary>
    </ModalButtonWrapper>
  );

  return (
    <Modal
      onClose={onClose}
      actions={actions}
      width={'650px'}
      height={'600px'}
    >
      <Root>
        <SelectedMountainsRoot>
          <DetailBoxTitle>
            <BasicIconInText icon={faMountain} />
            {getString('trip-report-add-additional-mtns-title')}
          </DetailBoxTitle>
          <SelectedMountainsDetails>
            {selectedMountainList}
          </SelectedMountainsDetails>
        </SelectedMountainsRoot>
        <SearchPanel>
          <StandardSearch
            placeholder={getString('global-text-value-search-mountains')}
            setSearchQuery={setSearchQuery}
            focusOnMount={false}
            initialQuery={searchQuery}
          />
          <SearchResults>
            {searchResults}
          </SearchResults>
        </SearchPanel>
      </Root>
    </Modal>
  );
};

export default MountainSelector;
