import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react/compat';
import gql from 'graphql-tag';
import React, {useContext, useEffect, useRef, useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {mountainDetailLink} from '../../../routing/Utils';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import { ExternalResource, Mountain, PermissionTypes, User } from '../../../types/graphQLTypes';
import { mobileSize } from '../../../Utils';
import { AppContext } from '../../App';
import BackButton from '../../sharedComponents/BackButton';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import MountainForm, {InitialMountainDatum, StateDatum} from './MountainForm';

const mountainQuery = `
      id
      name
      elevation
      latitude
      longitude
      description
      resources {
        title
        url
      }
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
      author {
        id
      }
      flag
`;

const GET_MOUNTAIN_AND_STATES = gql`
  query getMountain($id: ID) {
    mountain(id: $id) {
      ${mountainQuery}
    }
    states {
      id
      name
      abbreviation
    }
  }
`;

const mountainVariableTypes = `
  $name: String!,
  $elevation: Float!,
  $latitude: Float!,
  $longitude: Float!,
  $state: ID!,
  $description: String,
  $resources: [ExternalResourcesInputType],
`;

const mountainBaseVariables = `
  name: $name,
  elevation: $elevation,
  latitude: $latitude,
  longitude: $longitude,
  state: $state,
  description: $description,
  resources: $resources,
`;

export const ADD_MOUNTAIN = gql`
  mutation(
    $author: ID!,
    ${mountainVariableTypes}
  ) {
    mountain: addMountain(
      ${mountainBaseVariables}
      author: $author,
    ) {
      ${mountainQuery}
    }
  }
`;
const EDIT_MOUNTAIN = gql`
  mutation(
    $id: ID!,
    ${mountainVariableTypes}
  ) {
    mountain: updateMountain(
      id: $id,
      ${mountainBaseVariables}
    ) {
      ${mountainQuery}
    }
  }
`;

export interface MountainSuccessResponse {
  mountain: null | {
    id: Mountain['id'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
    state: Mountain['state'];
    description: Mountain['description'];
    resources: Mountain['resources'];
    author: null | {
      id: User['id'];
    }
    flag: Mountain['flag'];
  };
}

interface QuerySuccessResponse extends MountainSuccessResponse {
  states: null | StateDatum[];
}

export interface BaseMountainVariables {
  name: string;
  elevation: number;
  latitude: number;
  longitude: number;
  state: string;
  description: string | null;
  resources: ExternalResource[] | null;
}

export interface AddMountainVariables extends BaseMountainVariables {
  author: string;
}
interface EditMountainVariables extends BaseMountainVariables {
  id: string;
}

interface Props extends RouteComponentProps {
  user: User;
  mountainPermissions: null | number;
}

const MountainCreatePage = (props: Props) => {
  const { user, mountainPermissions, match, history } = props;
  const { id }: any = match.params;

  const userId = user._id;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

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

  const {loading, error, data} = useQuery<QuerySuccessResponse, {id: string | null}>(GET_MOUNTAIN_AND_STATES,
    {variables: { id: id ? id : null },
  });

  const [addMountain] = useMutation<MountainSuccessResponse, AddMountainVariables>(ADD_MOUNTAIN);
  const [editMountain] = useMutation<MountainSuccessResponse, EditMountainVariables>(EDIT_MOUNTAIN);

  let mountainForm: React.ReactElement<any> | null;
  if (mountainPermissions === -1) {
    mountainForm = (
      <PlaceholderText>
        {getFluentString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    mountainForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    mountainForm = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const states = data.states ? data.states : [];

    const submitMountainForm = async (input: BaseMountainVariables) => {
      try {
        if (id) {
          if (data && data.mountain && (
              (data.mountain.author && data.mountain.author.id === userId) ||
              user.permissions === PermissionTypes.admin)
            ) {
            const res = await editMountain({variables: {...input, id}});
            if (res && res.data && res.data.mountain) {
              history.push(mountainDetailLink(res.data.mountain.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
          const res = await addMountain({variables: {...input, author: userId}});
          if (res && res.data && res.data.mountain) {
            history.push(mountainDetailLink(res.data.mountain.id));
          } else {
            setIsErrorModalVisible(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (data.mountain && (
        (data.mountain.author && data.mountain.author.id === userId) ||
        user.permissions === PermissionTypes.admin)
      ) {
      const {mountain: {name, state, flag, description, resources}, mountain} = data;
      const nonNullResources: ExternalResource[] = [];
      if (resources) {
        resources.forEach(rsrc => {
          if (rsrc !== null && rsrc.title.length && rsrc.url.length) {
            nonNullResources.push({title: rsrc.title, url: rsrc.url});
          }
        });
      }
      const initialMountain: InitialMountainDatum = {
        id: mountain.id,
        name,
        latitude: mountain.latitude.toString(),
        longitude: mountain.longitude.toString(),
        elevation: mountain.elevation.toString(),
        description: description ? description : '',
        resources: nonNullResources,
        state, flag,
      };
      mountainForm = (
        <MountainForm
          states={states}
          initialData={initialMountain}
          onSubmit={submitMountainForm}
          mapContainer={mapContainer}
          onCancel={history.goBack}
        />
      );
    } else if (data.mountain) {
        mountainForm = (
        <PlaceholderText>
          {getFluentString('global-text-value-no-permission')}
        </PlaceholderText>
      );
    } else {
      const initialMountain: InitialMountainDatum = {
        id: '',
        name: '',
        latitude: '',
        longitude: '',
        elevation: '',
        state: null,
        flag: null,
        description: '',
        resources: [],
      };
      mountainForm = (
        <MountainForm
          states={states}
          initialData={initialMountain}
          onSubmit={submitMountainForm}
          mapContainer={mapContainer}
          onCancel={history.goBack}
        />
      );
    }
  } else {
    mountainForm = null;
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
          {mountainForm}
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

export default withRouter(MountainCreatePage);
