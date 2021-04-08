import upperFirst from 'lodash/upperFirst';
import React, {useState} from 'react';
import useFluent from '../../../../hooks/useFluent';
import {
  Details,
} from '../../../../styling/sharedContentStyles';
import {
  ButtonSecondary,
  LinkButtonCompact,
} from '../../../../styling/styleUtils';
import Modal from '../../Modal';

const AllClassification = () => {
  const getString = useFluent();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const actions = (
    <ButtonSecondary onClick={closeModal} mobileExtend={true}>
      {getString('global-text-value-modal-close')}
    </ButtonSecondary>
  );
  const trailClassifications = (
    <>

      <h2>{getString('global-text-value-trails')}</h2>
      <div>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'trail'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'trail'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'dirtroad'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'dirtroad'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'path'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'path'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'stairs'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'stairs'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'cycleway'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'cycleway'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'road'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'road'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'hiking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'hiking'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'bridleway'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'bridleway'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'demanding_mountain_hiking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'demanding_mountain_hiing'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'mountain_hiking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'mountain_hiking'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'herdpath'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'herdpath'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'alpine_hiking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'alpine_hiking'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'demanding_alpine_hiking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'demanding_alpine_hikig'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'difficult_alpine_hiking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'difficult_alpine_hikig'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'parent_trail'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'parent_trail'})}
          </small>
        </p>
      </div>
      <hr />
    </>
  );

  const campsiteClassifications = (
    <>
      <h2>{getString('global-text-value-camping')}</h2>
      <div>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'camp_site'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'camp_site'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'caravan_site'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'caravan_site'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'weather_shelter'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'weather_shelter'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'camp_pitch'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'camp_pitch'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'lean_to'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'lean_to'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'wilderness_hut'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'wilderness_hut'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'alpine_hut'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'alpine_hut'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'basic_hut'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'basic_hut'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'rock_shelter'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'rock_shelter'})}
          </small>
        </p>
      </div>
      <hr />
    </>
  );

  const orderedClassifications = window.location.pathname.includes('campsite') ? (
    <>
      {campsiteClassifications}
      {trailClassifications}
    </>
  ) : (
    <>
      {trailClassifications}
      {campsiteClassifications}
    </>
  );

  const modal = modalOpen === false ? null : (
    <Modal
      onClose={closeModal}
      width={'600px'}
      height={'auto'}
      actions={actions}
    >
      {orderedClassifications}
      <h2>{getString('global-text-value-parking')}</h2>
      <div>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'information_board'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'information_board'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'information_map'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'information_map'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'picnic_site'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'picnic_site'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'park'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'park'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'trailhead'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'trailhead'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'parking_space'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'parking_space'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'parking'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'parking'})}
          </small>
        </p>
        <p>
          <strong>
            {upperFirst(getString('global-type-official-classification', {type: 'intersection'}))}
          </strong>
          <br />
          <small>
            {getString('global-type-official-classification-description', {type: 'intersection'})}
          </small>
        </p>
      </div>
    </Modal>
  );

  return (
    <Details>
      <LinkButtonCompact onClick={openModal}>
        {getString('global-view-all-classifications')}
      </LinkButtonCompact>
      {modal}
    </Details>
  );
};

export default AllClassification;
