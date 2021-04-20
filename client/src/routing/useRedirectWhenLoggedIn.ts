import {useHistory} from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';

let alreadyRedirected: boolean = false;

const storageId = 'localstorageLastLocationBeforeLogInKeyId';

const useRedirectWhenLoggedIn = () => {
  const user = useCurrentUser();
  const {location: {pathname, search}, push} = useHistory();
  if (!user && user !== null) {
    localStorage.setItem(storageId, pathname + search);
  } else if (user && !alreadyRedirected) {
    const lastVisitedUrl = localStorage.getItem(storageId);
    if (lastVisitedUrl) {
      push(lastVisitedUrl);
      localStorage.removeItem(storageId);
    }
    alreadyRedirected = true;
  }
};

export default useRedirectWhenLoggedIn;
