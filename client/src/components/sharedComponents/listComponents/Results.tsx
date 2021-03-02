import React, {useState} from 'react';
import useDirectionsOrigin from '../../../hooks/directions/useDirectionsOrigin';
import useFluent from '../../../hooks/useFluent';
import useMapCenter from '../../../hooks/useMapCenter';
import {
  ButtonSecondary,
  NoResults,
  Subtext,
} from '../../../styling/styleUtils';
import {AggregateItem, CoreItem} from '../../../types/itemTypes';
import SetOrigin from '../detailComponents/directions/SetOrigin';
import Modal, {ButtonWrapper} from '../Modal';
import ResultItem, {TypeProps as Datum} from './ResultItem';

interface Props {
  data: Datum[];
  type: CoreItem | AggregateItem | null;
}

const Results = (props: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const getString = useFluent();
  const mapCenter = useMapCenter();
  const {location, updateLocation, getUsersLocation} = useDirectionsOrigin();

  const clearAndOpenOriginModal = () => {
    updateLocation(null);
    setModalOpen(true);
  };

  const reults = props.data.map(d => (
    <ResultItem
      key={d.id}
      mapCenter={mapCenter}
      usersLocation={location.data}
      changeUsersLocation={clearAndOpenOriginModal}
      {...d}
    />
  ));

  const onClose = () => setModalOpen(false);

  const actions = (
    <ButtonWrapper>
      <ButtonSecondary onClick={onClose} mobileExtend={true}>
        {getString('global-text-value-modal-close')}
      </ButtonSecondary>
    </ButtonWrapper>
  );

  const setOriginModal = modalOpen && !location.data ? (
    <Modal
      onClose={onClose}
      width={'500px'}
      height={'auto'}
      actions={actions}
      contentStyles={{padding: 0, marginBottom: '-1rem', overflow: 'visible'}}
    >
      <SetOrigin
        error={location.error}
        loading={location.loading}
        updateLocation={updateLocation}
        getUsersLocation={getUsersLocation}
      />
      <div style={{width: 500}} />
    </Modal>
  ) : null;

  return reults.length ? (
    <>
      <NoResults>
        <Subtext>{getString('global-text-value-results-near-center', {
          type: props.type ? props.type + 's' : 'results',
        })}</Subtext>
      </NoResults>
      {reults}
      {setOriginModal}
    </>
  ) :
  (
    <NoResults>
      <em>{getString('global-text-value-no-items-found-map', {
        type: props.type ? props.type + 's' : 'results',
      })}</em>
    </NoResults>

  );
};

export default Results;
