import { gql, useQuery } from '@apollo/client';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  ButtonPrimary,
  ButtonSecondary,
  lightBlue,
  lightBorderColor,
  PlaceholderText,
} from '../../../styling/styleUtils';
import { PeakList } from '../../../types/graphQLTypes';
import {
  CheckboxContainer,
  MountainDatum,
  MountainItem as PeakListItem,
  Subtitle,
} from '../../peakLists/create/MountainSelectionModal';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal, {mobileWidth} from '../../sharedComponents/Modal';
import StandardSearch from '../../sharedComponents/StandardSearch';

const SEARCH_PEAK_LISTS = gql`
  query SearchPeakLists(
    $searchQuery: String!,
    $pageNumber: Int!,
    $nPerPage: Int!,
  ) {
    peakLists: peakListsSearch(
      searchQuery: $searchQuery,
      pageNumber: $pageNumber,
      nPerPage: $nPerPage,
    ) {
      id
      name
      shortName
      type
      mountains {
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
      optionalMountains {
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
      parent {
        id
      }
    }
  }
`;

export interface PeakListDatum {
  id: PeakList['id'];
  name: PeakList['name'];
  shortName: PeakList['shortName'];
  mountains: null | MountainDatum[];
  optionalMountains: null | MountainDatum[];
  parent: null | { id: PeakList['id'] };
}

interface SuccessResponse {
  peakLists: null | PeakListDatum[];
}

interface Variables {
  searchQuery: string;
  pageNumber: number;
  nPerPage: number;
}

const Container = styled(CheckboxContainer)`
  border: 1px solid ${lightBorderColor};
  height: 300px;
  overflow: auto;
`;

const SelectedItem = styled(PeakListItem)`
  background-color: ${lightBlue};
  margin: 1rem 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${mobileWidth}px) {
    padding: 1rem 0.5rem;
  }
`;

const CancelButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`;

interface Props {
  copyMountains: (mountainArray: MountainDatum[], optionalMountainsArray: MountainDatum[]) => void;
  onCancel: () => void;
}

const AreYouSureModal = (props: Props) => {
  const { copyMountains, onCancel } = props;

  const getString = useFluent();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedList, setSelectedList] = useState<PeakListDatum | null>(null);

  const {loading, error, data} = useQuery<SuccessResponse, Variables>(SEARCH_PEAK_LISTS, {
    variables: {
      searchQuery,
      pageNumber: 1,
      nPerPage: searchQuery.length ? 20 : 0,
    },
  });

  let peakListList: React.ReactElement<any> | null;
  if (searchQuery.length === 0) {
    peakListList = null;
  } else if (loading === true) {
    peakListList = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    peakListList = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const { peakLists } = data;
    const peakListElms = !peakLists ? null : peakLists.map(list => {
      if (list && list.parent === null && list.mountains) {
        return (
          <PeakListItem
            key={list.id}
            onClick={() => setSelectedList(list)}
          >
            {list.name} ({list.shortName})
            <Subtitle>
              {list.mountains.length} {getString('global-text-value-mountains')}
            </Subtitle>
          </PeakListItem>
        );
      } else {
         return null;
      }
    });
    peakListList = (
      <>{peakListElms}</>
    );
  } else {
    peakListList = null;
  }

  const selected = selectedList === null || selectedList.mountains === null ? null : (
    <SelectedItem>
      <strong>{getString('global-text-value-selected')}</strong>
      {' '}{selectedList.name} ({selectedList.shortName})
      <Subtitle>
        {selectedList.mountains.length} {getString('global-text-value-mountains')}
      </Subtitle>
    </SelectedItem>
  );

  const copyAndClose = () => {
    if (selectedList && selectedList.mountains) {
      const optionalMountains = selectedList.optionalMountains !== null ? selectedList.optionalMountains : [];
      copyMountains([...selectedList.mountains], [...optionalMountains]);
    }
    onCancel();
  };

  const handleCopyMountains = () => {
    copyAndClose();
  };

  const actions = (
    <ButtonWrapper>
      <CancelButton onClick={onCancel}>
        {getString('global-text-value-modal-close')}
      </CancelButton>
      <ButtonPrimary onClick={handleCopyMountains}>
        {getString('create-peak-list-copy-mountains-button')}
      </ButtonPrimary>
    </ButtonWrapper>
  );

  return (
    <Modal
      onClose={onCancel}
      width={'600px'}
      height={'auto'}
      actions={actions}
    >
      <h3>{getString('create-peak-list-select-parent-modal-button')}</h3>
      {selected}
      <StandardSearch
        placeholder={getString('global-text-value-search-hiking-lists')}
        setSearchQuery={setSearchQuery}
        focusOnMount={true}
        initialQuery={searchQuery}
      />
      <Container>
        {peakListList}
      </Container>
    </Modal>
  );
};

export default AreYouSureModal;
