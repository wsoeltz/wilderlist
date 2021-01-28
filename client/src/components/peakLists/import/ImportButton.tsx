import {faUpload} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {MountainDatum} from '../../../queries/lists/usePeakListMountains';
import {
  BasicIconInTextCompact,
  LinkButtonCompact,
} from '../../../styling/styleUtils';
import {PeakListVariants} from '../../../types/graphQLTypes';
import SignUpModal from '../../sharedComponents/SignUpModal';
import ImportAscentsModal from './';
import ImportGridModal, { NH48_GRID_OBJECT_ID } from './ImportGrid';

interface Props {
  peakListId: string;
  variant: PeakListVariants;
  mountains: MountainDatum[];
}

const ImportButton = (props: Props) => {
  const {variant, peakListId, mountains} = props;
  const user = useCurrentUser();
  const getString = useFluent();
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  let importAscentsModal: React.ReactElement<any> | null;
  if (user && isImportModalOpen === true) {
    if (variant === PeakListVariants.standard || variant === PeakListVariants.winter) {
      importAscentsModal = (
        <ImportAscentsModal
          userId={user._id}
          mountains={mountains}
          onCancel={() => setIsImportModalOpen(false)}
        />
     ) ;
    } else if (variant === PeakListVariants.grid && peakListId === NH48_GRID_OBJECT_ID) {
      importAscentsModal = (
          <ImportGridModal
            userId={user._id}
            onCancel={() => setIsImportModalOpen(false)}
          />
      );
    } else {
      importAscentsModal = null;
    }
  } else if (isImportModalOpen === true) {
    importAscentsModal = (
        <SignUpModal
          text={getString('global-text-value-modal-sign-up-today-import')}
          onCancel={() => setIsImportModalOpen(false)}
        />
    );
  } else {
    importAscentsModal = null;
  }

  if (variant === PeakListVariants.standard || variant === PeakListVariants.winter ||
      (variant === PeakListVariants.grid && peakListId === NH48_GRID_OBJECT_ID)
    ) {
    return (
      <>
        <LinkButtonCompact onClick={() => setIsImportModalOpen(true)}>
          <BasicIconInTextCompact icon={faUpload} />
          {getString('mountain-table-import-button')}
        </LinkButtonCompact>
        {importAscentsModal}
      </>
    );
  } else {
    return null;
  }
};

export default ImportButton;
