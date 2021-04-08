import React, {useCallback} from 'react';
import { useUpdateCampsiteFlag } from '../../../../../queries/campsites/flagCampsite';
import { useUpdatePeakListFlag } from '../../../../../queries/lists/flagPeakList';
import { useUpdateMountainFlag } from '../../../../../queries/mountains/flagMountain';
import { useUpdateTrailFlag } from '../../../../../queries/trails/flagTrail';
import {AggregateItem, CoreItem} from '../../../../../types/itemTypes';
import Modal from './Modal';

interface Props {
  name: string;
  id: string;
  type: CoreItem | AggregateItem;
  onClose: () => void;
}

const FlagMountain = (props: Props) => {
  const {name, id, type, onClose} = props;

  const updateMountainFlag = useUpdateMountainFlag();
  const onSave = useCallback((flag: string) => {
    updateMountainFlag({variables: {id, flag}});
  }, [id, updateMountainFlag]);

  return (
    <Modal
      id={id}
      name={name}
      type={type}
      onSave={onSave}
      onClose={onClose}
    />
  );
};

const FlagTrail = (props: Props) => {
  const {name, id, type, onClose} = props;

  const updateTrailFlag = useUpdateTrailFlag();
  const onSave = useCallback((flag: string) => {
    updateTrailFlag({variables: {id, flag}});
  }, [id, updateTrailFlag]);

  return (
    <Modal
      id={id}
      name={name}
      type={type}
      onSave={onSave}
      onClose={onClose}
    />
  );
};

const FlagCampsite = (props: Props) => {
  const {name, id, type, onClose} = props;

  const updateCampsiteFlag = useUpdateCampsiteFlag();
  const onSave = useCallback((flag: string) => {
    updateCampsiteFlag({variables: {id, flag}});
  }, [id, updateCampsiteFlag]);

  return (
    <Modal
      id={id}
      name={name}
      type={type}
      onSave={onSave}
      onClose={onClose}
    />
  );
};

const FlagPeakList = (props: Props) => {
  const {name, id, type, onClose} = props;

  const updatePeakListFlag = useUpdatePeakListFlag();
  const onSave = useCallback((flag: string) => {
    updatePeakListFlag({variables: {id, flag}});
  }, [id, updatePeakListFlag]);

  return (
    <Modal
      id={id}
      name={name}
      type={type}
      onSave={onSave}
      onClose={onClose}
    />
  );
};

const FlagModal = (props: Props) => {
  const { type, id, name, onClose } = props;

  if (type === CoreItem.mountain) {
    return (
      <FlagMountain
        id={id}
        name={name}
        type={type}
        onClose={onClose}
      />
    );
  } else if (type === CoreItem.trail) {
    return (
      <FlagTrail
        id={id}
        name={name}
        type={type}
        onClose={onClose}
      />
    );
  } else if (type === CoreItem.campsite) {
    return (
      <FlagCampsite
        id={id}
        name={name}
        type={type}
        onClose={onClose}
      />
    );
  } else if (type === AggregateItem.list) {
    return (
      <FlagPeakList
        id={id}
        name={name}
        type={type}
        onClose={onClose}
      />
    );
  } else {
    return null;
  }
};

export default FlagModal;
