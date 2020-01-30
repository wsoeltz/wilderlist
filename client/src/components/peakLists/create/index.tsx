import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useState, useRef, useEffect} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import BackButton from '../../sharedComponents/BackButton';
// import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import PeakListForm, {InitialPeakListDatum, FormInput} from './PeakListForm';
import {
  PeakList,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import { AppContext } from '../../App';
import { mobileSize } from '../../../Utils';
import {listDetailLink} from '../../../routing/Utils';

const ADD_PEAK_LIST = gql`
  mutation(
    $name: String!,
    $shortName: String!,
    $description: String,
    $optionalPeaksDescription: String,
    $type: PeakListVariants!,
    $mountains: [ID!],
    $optionalMountains: [ID],
    $parent: ID,
    $states: [ID!],
    $resources: [ExternalResourcesInputType],
    $author: ID!,
    $tier: PeakListTier!,
  ) {
    peakList: addPeakList(
      name: $name,
      shortName: $shortName,
      description: $description,
      optionalPeaksDescription: $optionalPeaksDescription,
      type: $type,
      mountains: $mountains,
      optionalMountains: $optionalMountains,
      parent: $parent,
      states: $states,
      resources: $resources,
      author: $author,
      tier: $tier,
    ) {
      id
      name
      shortName
      description
      optionalPeaksDescription
      type
      mountains {
        id
      }
      optionalMountains {
        id
      }
      parent {
        id
      }
      states {
        id
      }
      resources {
        title
        url
      }
      author {
        id
      }
      tier
      flag
      status
    }
  }
`;

interface BaseVariables extends FormInput {
  author: string;
}

interface SuccessResponse {
  peakList: {
    id: PeakList['id'];
    name: PeakList['name'];
    shortName: PeakList['shortName'];
    description: PeakList['description'];
    optionalPeaksDescription: PeakList['optionalPeaksDescription'];
    type: PeakList['type'];
    mountains: PeakList['mountains'];
    optionalMountains: PeakList['optionalMountains'];
    parent: PeakList['parent'];
    states: PeakList['states'];
    resources: PeakList['resources'];
    author: PeakList['author'];
    tier: PeakList['tier'];
    flag: PeakList['flag'];
    status: PeakList['status'];
  }
}

interface Props extends RouteComponentProps {
  userId: string | null;
  peakListPermissions: null | number;
}

const PeakListCreatePage = (props: Props) => {
  const { userId, peakListPermissions, match, history } = props;
  const { id }: any = match.params;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [addPeakList] = useMutation<SuccessResponse, BaseVariables>(ADD_PEAK_LIST);

  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const { windowWidth } = useContext(AppContext);
  const mapContainerNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (windowWidth >= mobileSize && mapContainerNodeRef.current !== null) {
      setMapContainer(mapContainerNodeRef.current);
    } else {
      setMapContainer(null);
    }
  }, [windowWidth])

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  let peakListForm: React.ReactElement<any> | null;
  if (peakListPermissions === -1) {
    peakListForm = (
      <PlaceholderText>
        {getFluentString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else {
    const initialData: InitialPeakListDatum = {
      id: undefined,
      name: '',
      shortName: '',
      description: '',
      optionalPeaksDescription: '',
      type: PeakListVariants.standard,
      mountains: [],
      optionalMountains: [],
      flag: null,
      tier: undefined,
      resources: [],
    }
    const onSubmit = async (input: FormInput) => {
      try {
        if (userId) {
          const res = await addPeakList({variables: {...input, author: userId}});
          if (res && res.data && res.data.peakList) {
            history.push(listDetailLink(res.data.peakList.id));
          } else {
            setIsErrorModalVisible(true);
          }
        }

      } catch (e) {
        console.error(e);
      }
    }
    peakListForm = (
      <div>
        userId: {userId} | peakListId: {id}
        <PeakListForm
          initialData={initialData}
          onSubmit={onSubmit}
          mapContainer={mapContainer}
        />
      </div>
    );
  }
  const closeErrorModal = () => setIsErrorModalVisible(false);
  const errorModal = isErrorModalVisible === false ? null : (
    <Modal
      onClose={closeErrorModal}
      width={'600px'}
      height={'auto'}
      actions={(
        <ButtonSecondary onClick={closeErrorModal}>
          {getFluentString('global-text-value-modal-close')}
        </ButtonSecondary>
        )}
    >
      <p>{getFluentString('global-error-saving-data')}</p>
    </Modal>
  );

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          {peakListForm}
        </ContentBody>
        {errorModal}
      </ContentLeftLarge>
      <ContentRightSmall>
        <ContentBody ref={mapContainerNodeRef}>
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(PeakListCreatePage);
