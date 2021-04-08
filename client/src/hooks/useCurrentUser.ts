import { useContext } from 'react';
import {
  UserContext,
} from '../contextProviders/userContext';

const useCurrentUser = () => {
  const user = useContext(UserContext);
  return user;
};

export default useCurrentUser;
