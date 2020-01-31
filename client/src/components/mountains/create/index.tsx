import { useMutation, useQuery } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
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
import { Mountain, State, User } from '../../../types/graphQLTypes';
import { mobileSize } from '../../../Utils';
import { AppContext } from '../../App';
import BackButton from '../../sharedComponents/BackButton';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import Modal from '../../sharedComponents/Modal';
import MountainForm, {InitialMountainDatum, StateDatum} from './MountainForm';

const GET_MOUNTAIN_AND_STATES = gql`
  query getMountain($id: ID) {
    mountain(id: $id) {
      id
      name
      elevation
      latitude
      longitude
      state {
        id
      }
      author {
        id
      }
      flag
    }
    states {
      id
      name
      abbreviation
    }
  }
`;

const ADD_MOUNTAIN = gql`
  mutation(
    $name: String!, $elevation: Float!, $latitude: Float!, $longitude: Float!, $state: ID!, $author: ID!,
  ) {
    mountain: addMountain(
      name: $name,
      elevation: $elevation,
      latitude: $latitude,
      longitude: $longitude,
      state: $state,
      author: $author,
    ) {
      id
      name
      elevation
      latitude
      longitude
      state {
        id
      }
      author {
        id
      }
      flag
    }
  }
`;
const EDIT_MOUNTAIN = gql`
  mutation(
    $id: ID!, $name: String!, $elevation: Float!, $latitude: Float!, $longitude: Float!, $state: ID!,
  ) {
    mountain: updateMountain(
      id: $id,
      name: $name,
      elevation: $elevation,
      latitude: $latitude,
      longitude: $longitude,
      state: $state,
    ) {
      id
      name
      elevation
      latitude
      longitude
      state {
        id
      }
      author {
        id
      }
      flag
    }
  }
`;

interface MountainSuccessResponse {
  mountain: null | {
    id: Mountain['id'];
    name: Mountain['name'];
    elevation: Mountain['elevation'];
    latitude: Mountain['latitude'];
    longitude: Mountain['longitude'];
    state: null | {
      id: State['id'];
    }
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
}

interface AddMountainVariables extends BaseMountainVariables {
  author: string;
}
interface EditMountainVariables extends BaseMountainVariables {
  id: string;
}

interface Props extends RouteComponentProps {
  userId: string | null;
  mountainPermissions: null | number;
}

const MountainCreatePage = (props: Props) => {
  const { userId, mountainPermissions, match, history } = props;
  const { id }: any = match.params;

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
          if (data && data.mountain && data.mountain.author && data.mountain.author.id === userId) {
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

    if (data.mountain && data.mountain.author && data.mountain.author.id === userId) {
      const {mountain: {name, state, flag}, mountain} = data;
      const initialMountain: InitialMountainDatum = {
        id: mountain.id,
        name,
        latitude: mountain.latitude.toString(),
        longitude: mountain.longitude.toString(),
        elevation: mountain.elevation.toString(),
        state, flag,
      };
      mountainForm = (
        <MountainForm
          states={states}
          initialData={initialMountain}
          onSubmit={submitMountainForm}
          mapContainer={mapContainer}
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
      };
      mountainForm = (
        <MountainForm
          states={states}
          initialData={initialMountain}
          onSubmit={submitMountainForm}
          mapContainer={mapContainer}
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
