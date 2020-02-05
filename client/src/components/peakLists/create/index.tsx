import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext, useEffect, useRef, useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {listDetailLink} from '../../../routing/Utils';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import {
  ExternalResource,
  Mountain,
  PeakList,
  PeakListVariants,
} from '../../../types/graphQLTypes';
import { mobileSize } from '../../../Utils';
import { AppContext } from '../../App';
import BackButton from '../../sharedComponents/BackButton';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import PeakListForm, {FormInput, InitialPeakListDatum} from './PeakListForm';

const baseQuery = `
  id
  name
  shortName
  description
  optionalPeaksDescription
  type
  mountains {
    id
    name
    latitude
    longitude
    elevation
    state {
      id
      name
      abbreviation
      regions {
        id
        name
        states {
          id
        }
      }
    }
  }
  optionalMountains {
    id
    name
    latitude
    longitude
    elevation
    state {
      id
      name
      abbreviation
      regions {
        id
        name
        states {
          id
        }
      }
    }
  }
  parent {
    id
    name
    mountains {
      id
      name
      latitude
      longitude
      elevation
      state {
        id
        name
        abbreviation
        regions {
          id
          name
          states {
            id
          }
        }
      }
    }
    optionalMountains {
      id
      name
      latitude
      longitude
      elevation
      state {
        id
        name
        abbreviation
        regions {
          id
          name
          states {
            id
          }
        }
      }
    }
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
`;

const baseMutationVariableDefs = `
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
  $tier: PeakListTier!,
`;
const baseMutationVariables = `
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
  tier: $tier,
`;

const ADD_PEAK_LIST = gql`
  mutation addPeakList(
    $author: ID!,
    ${baseMutationVariableDefs}
  ) {
    peakList: addPeakList(
      author: $author,
      ${baseMutationVariables}
    ) {
      ${baseQuery}
    }
  }
`;
const EDIT_PEAK_LIST = gql`
  mutation editPeakList(
    $id: ID!,
    ${baseMutationVariableDefs}
  ) {
    peakList: editPeakList(
      id: $id,
      ${baseMutationVariables}
    ) {
      ${baseQuery}
    }
  }
`;

const GET_PEAK_LIST = gql`
  query getPeakList($id: ID) {
    peakList(
      id: $id) {
      ${baseQuery}
    }
  }
`;

interface BaseVariables extends FormInput {
  author: string;
}

interface EditVariables extends FormInput {
  id: string;
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
  };
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

  const {loading, error, data} = useQuery<SuccessResponse, {id: string | null}>(GET_PEAK_LIST,
    {variables: { id: id ? id : null },
  });

  const [addPeakList] = useMutation<SuccessResponse, BaseVariables>(ADD_PEAK_LIST);
  const [editPeakList] = useMutation<SuccessResponse, EditVariables>(EDIT_PEAK_LIST);

  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const { windowWidth } = useContext(AppContext);
  const mapContainerNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (windowWidth >= mobileSize && mapContainerNodeRef.current !== null) {
      setMapContainer(mapContainerNodeRef.current);
    } else {
      setMapContainer(null);
    }
  }, [windowWidth]);

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  let peakListForm: React.ReactElement<any> | null;
  if (peakListPermissions === -1) {
    peakListForm = (
      <PlaceholderText>
        {getFluentString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    peakListForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    peakListForm = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {

    const onSubmit = async (input: FormInput) => {
      try {
        if (id) {
          if (data && data.peakList && data.peakList.author && data.peakList.author.id === userId) {
            const res = await editPeakList({variables: {...input, id}});
            if (res && res.data && res.data.peakList) {
              history.push(listDetailLink(res.data.peakList.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
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
    };

    if (data.peakList && data.peakList.author && data.peakList.author.id === userId) {
      const {
        peakList: {
          name, shortName, description, optionalPeaksDescription, type,
          flag, tier, resources, parent,
        }, peakList,
      } = data;
      const mountains = parent && parent.mountains ? parent.mountains : peakList.mountains;
      const optionalMountains = parent && parent.optionalMountains
        ? parent.optionalMountains : peakList.optionalMountains;
      const nonNullMountains: Mountain[] = [];
      mountains.forEach(mtn => {
        if (mtn !== null) {
          nonNullMountains.push(mtn);
        }
      });
      const nonNullOptionalMountains: Mountain[] = [];
      if (optionalMountains) {
        optionalMountains.forEach(mtn => {
          if (mtn !== null) {
            nonNullOptionalMountains.push(mtn);
          }
        });
      }
      const nonNullResources: ExternalResource[] = [];
      if (resources) {
        resources.forEach(rsrc => {
          if (rsrc !== null && rsrc.title.length && rsrc.url.length) {
            nonNullResources.push({title: rsrc.title, url: rsrc.url});
          }
        });
      }
      const initialData: InitialPeakListDatum = {
        id: peakList.id,
        name, shortName,
        description: description ? description : '',
        optionalPeaksDescription: optionalPeaksDescription ? optionalPeaksDescription : '',
        type,
        mountains: nonNullMountains,
        optionalMountains: nonNullOptionalMountains,
        flag,
        tier: tier ? tier : undefined,
        resources: nonNullResources,
        parent,
      };
      peakListForm = (
        <PeakListForm
          initialData={initialData}
          onSubmit={onSubmit}
          mapContainer={mapContainer}
        />
      );
    } else if (data.peakList) {
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
        parent: null,
      };
      peakListForm = (
        <PeakListForm
          initialData={initialData}
          onSubmit={onSubmit}
          mapContainer={mapContainer}
        />
      );
    }

  } else {
    peakListForm = null;
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
