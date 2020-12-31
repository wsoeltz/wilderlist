import { gql, useMutation, useQuery } from '@apollo/client';
import { User } from '../../types/graphQLTypes';

const GET_USER_PROFILE_DATA = gql`
  query getUserPrivacyData($id: ID!) {
    user(id: $id) {
      id
      name
      email
      redditId
      facebookId
      profilePictureUrl
      hideEmail
      hideProfilePicture
      hideProfileInSearch
      disableEmailNotifications
    }
  }
`;

interface QuerySuccess {
  user: {
    id: User['id'];
    name: User['name'];
    email: User['email'];
    redditId: User['redditId'];
    facebookId: User['facebookId'];
    profilePictureUrl: User['profilePictureUrl'];
    hideEmail: User['hideEmail'];
    hideProfilePicture: User['hideProfilePicture'];
    hideProfileInSearch: User['hideProfileInSearch'];
    disableEmailNotifications: User['disableEmailNotifications'];
  };
}

interface QueryVariables {
  id: string;
}

const UPDATE_EMAIL = gql`
  mutation updateEmail($id: ID!, $value: String!) {
    user: updateEmail(id: $id, value: $value) {
      id
    }
  }
`;

const SET_HIDE_EMAIL = gql`
  mutation setHideEmail($id: ID!, $value: Boolean!) {
    user: setHideEmail(id: $id, value: $value) {
      id
    }
  }
`;

const SET_HIDE_PROFILE_PICTURE = gql`
  mutation setHideProfilePicture($id: ID!, $value: Boolean!) {
    user: setHideProfilePicture(id: $id, value: $value) {
      id
    }
  }
`;

const SET_HIDE_PROFILE_IN_SEARCH_RESULTS = gql`
  mutation setHideProfileInSearchResults($id: ID!, $value: Boolean!) {
    user: setHideProfileInSearchResults(id: $id, value: $value) {
      id
    }
  }
`;

const SET_DISABLE_EMAIL_NOTIFICATIONS = gql`
  mutation setDisableEmailNotifications($id: ID!, $value: Boolean!) {
    user: setDisableEmailNotifications(id: $id, value: $value) {
      id
    }
  }
`;

interface MutationSuccess {
  user: {
    id: User['id'];
  };
}

interface MutationVariables {
  id: string;
  value: boolean;
}

interface EditEmailVariables {
  id: string;
  value: string;
}

export const useUsersSettings = (userId: string) => {
  const {loading, error, data} = useQuery<QuerySuccess, QueryVariables>(GET_USER_PROFILE_DATA, {
    variables: { id: userId },
  });

  const [updateEmail] = useMutation<MutationSuccess, EditEmailVariables>(UPDATE_EMAIL, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideEmail] = useMutation<MutationSuccess, MutationVariables>(SET_HIDE_EMAIL, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideProfilePicture] = useMutation<MutationSuccess, MutationVariables>(SET_HIDE_PROFILE_PICTURE, {
    refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
  });
  const [setHideProfileInSearchResults] =
    useMutation<MutationSuccess, MutationVariables>(SET_HIDE_PROFILE_IN_SEARCH_RESULTS, {
      refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
    });
  const [setDisableEmailNotifications] =
    useMutation<MutationSuccess, MutationVariables>(SET_DISABLE_EMAIL_NOTIFICATIONS, {
      refetchQueries: () => [{query: GET_USER_PROFILE_DATA, variables: {id: userId}}],
    });

  return {
      loading, error, data,
      updateEmail, setHideEmail,
      setHideProfilePicture, setHideProfileInSearchResults,
      setDisableEmailNotifications,
    };
};
