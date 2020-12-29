import { gql, useMutation, useQuery } from '@apollo/client';
import queryString from 'query-string';
import React, {useCallback, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {Routes} from '../../../routing/routes';
import {mountainDetailLink} from '../../../routing/Utils';
import { ButtonSecondary, PlaceholderText } from '../../../styling/styleUtils';
import { ExternalResource, Mountain, PermissionTypes, User } from '../../../types/graphQLTypes';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import MountainForm, {InitialMountainDatum, StateDatum} from './MountainForm';

const mountainQuery = `
      id
      name
      elevation
      latitude
      longitude
      location
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
    location: Mountain['location'];
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

interface QueryVariables {
  lat?: string;
  lng?: string;
}

const ModalActions = ({closeErrorModal}: {closeErrorModal: () => void}) => {
  const getString = useFluent();
  return (
    <ButtonSecondary onClick={closeErrorModal} mobileExtend={true}>
      {getString('global-text-value-modal-close')}
    </ButtonSecondary>
  );
};

const MemoedActions = React.memo(ModalActions);

const MountainCreatePage = () => {
  const user = useCurrentUser();
  const { id }: any = useParams();
  const history = useHistory();
  const {lat, lng}: QueryVariables = queryString.parse(history.location.search);

  const getString = useFluent();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const closeErrorModal = useCallback(() => setIsErrorModalVisible(false), []);

  const {loading, error, data} = useQuery<QuerySuccessResponse, {id: string | null}>(GET_MOUNTAIN_AND_STATES,
    {variables: { id: id ? id : null },
  });

  const [addMountain] = useMutation<MountainSuccessResponse, AddMountainVariables>(ADD_MOUNTAIN);
  const [editMountain] = useMutation<MountainSuccessResponse, EditMountainVariables>(EDIT_MOUNTAIN);

  let mountainForm: React.ReactElement<any> | null;
  if (!user) {
    mountainForm = null;
  } else if (user.mountainPermissions === -1) {
    mountainForm = (
      <PlaceholderText>
        {getString('global-text-value-no-permission')}
      </PlaceholderText>
    );
  } else if (loading === true) {
    mountainForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    mountainForm = (
      <PlaceholderText>
        {getString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const states = data.states ? data.states : [];
    const userId = user ? user._id : null;

    const submitMountainForm = (addAnother: boolean) => async (input: BaseMountainVariables) => {
      try {
        if (id) {
          if (data && data.mountain && (
              (data.mountain.author && data.mountain.author.id === userId) ||
              user.permissions === PermissionTypes.admin)
            ) {
            const res = await editMountain({variables: {...input, id}});
            if (addAnother === true) {
              window.location.href =
                Routes.CreateMountain +
                '?lat=' + (input.latitude + 0.001) +
                '&lng=' + (input.longitude + 0.001);
            } else if (res && res.data && res.data.mountain) {
              history.push(mountainDetailLink(res.data.mountain.id));
            } else {
              setIsErrorModalVisible(true);
            }
          } else {
            setIsErrorModalVisible(true);
          }
        } else if (userId) {
          const res = await addMountain({variables: {...input, author: userId}});
          if (addAnother === true) {
            window.location.href =
              Routes.CreateMountain +
              '?lat=' + (input.latitude + 0.001) +
              '&lng=' + (input.longitude + 0.001);
          } else if (res && res.data && res.data.mountain) {
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
          onSubmit={submitMountainForm(false)}
          onSubmitAndAddAnother={null}
          onCancel={history.goBack}
        />
      );
    } else if (data.mountain) {
        mountainForm = (
        <PlaceholderText>
          {getString('global-text-value-no-permission')}
        </PlaceholderText>
      );
    } else {
      const latitude: string = lat ? lat : '';
      const longitude: string = lng ? lng : '';
      const initialMountain: InitialMountainDatum = {
        id: '',
        name: '',
        latitude,
        longitude,
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
          onSubmit={submitMountainForm(false)}
          onSubmitAndAddAnother={submitMountainForm(true)}
          onCancel={history.goBack}
        />
      );
    }
  } else {
    mountainForm = null;
  }
  const errorModal = isErrorModalVisible === false ? null : (
    <Modal
      onClose={closeErrorModal}
      width={'600px'}
      height={'auto'}
      actions={MemoedActions}
    >
      <p>{getString('global-error-saving-data')}</p>
    </Modal>
  );

  return (
    <>
      {mountainForm}
      {errorModal}
    </>
  );
};

export default MountainCreatePage;
