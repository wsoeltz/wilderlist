import { gql, useQuery } from '@apollo/client';
import { GetString } from 'fluent-react/compat';
import React, {useContext, useState} from 'react';
import styled, {keyframes} from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  CompactButtonPrimary,
  CompactGhostButton,
  lowWarningColorLight,
} from '../../../styling/styleUtils';
import {PeakList, PeakListVariants} from '../../../types/graphQLTypes';
import { UserContext } from '../../App';
import ImportAscentsModal, {MountainDatum} from '../import';
import ImportGridModal, {NH48_GRID_OBJECT_ID} from '../import/ImportGrid';

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID!) {
    peakList(id: $id) {
      id
      mountains {
        id
        name
        elevation
        state {
          id
          abbreviation
        }
      }
    }
  }
`;

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    mountains: MountainDatum[];
  };
}

const slideIn = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const Root = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  background-color: ${lowWarningColorLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.3rem;
  box-sizing: border-box;
  animation: 0.5s ease 0s 1 ${slideIn};
`;

interface Props {
  closeNotification: () => void;
  type: PeakListVariants;
  peakListId: string;
}

const ImportAscentsNotification = (props: Props) => {
  const {
    closeNotification, type, peakListId,
  } = props;

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const user = useContext(UserContext);

  const {loading, error, data} = useQuery<SuccessResponse, {id: string}>(GET_PEAK_LIST, {
    variables: { id: peakListId },
  });

  let importAscentsModal: React.ReactElement<any> | null;
  if (user && isImportModalOpen === true) {
    if (loading === false && !error && data !== undefined && data.peakList) {
      const mountains = data.peakList.mountains ? data.peakList.mountains : [];
      if (type === PeakListVariants.standard || type === PeakListVariants.winter) {
        importAscentsModal = (
          <ImportAscentsModal
            userId={user._id}
            mountains={mountains}
            onCancel={() => setIsImportModalOpen(false)}
          />
       ) ;
      } else if (type === PeakListVariants.grid && data.peakList.id === NH48_GRID_OBJECT_ID) {
        importAscentsModal = (
            <ImportGridModal
              userId={user._id}
              onCancel={() => setIsImportModalOpen(false)}
            />
        );
      } else {
        importAscentsModal = null;
      }
    } else {
      importAscentsModal = null;
    }
  } else {
      importAscentsModal = null;
  }
  return (
    <Root>
      <Content>
        <small>{getFluentString('import-ascents-notification-text')}</small>
        <div>
          <CompactButtonPrimary onClick={() => setIsImportModalOpen(true)}>
            {getFluentString('import-ascents-title')}
          </CompactButtonPrimary>
          <CompactGhostButton onClick={closeNotification}>Dismiss</CompactGhostButton>
        </div>
      </Content>
      {importAscentsModal}
    </Root>
  );

};

export default ImportAscentsNotification;
