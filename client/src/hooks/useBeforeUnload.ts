import {useEffect, useRef} from 'react';
import { useBeforeunload } from 'react-beforeunload';
import {useHistory} from 'react-router-dom';
import useFluent from './useFluent';

function useBeforeUnload(when: boolean | (() => boolean), customMessage?: string) {
  const history = useHistory();
  const unblock = useRef<any>(null);
  const getString = useFluent();
  const message = customMessage ? customMessage : getString('global-text-value-unsaved-changes');

  useEffect(() => {
    if ((typeof when === 'function' && when()) || (typeof when === 'boolean' && when)) {
      unblock.current = history.block(message);
    } else {
      unblock.current = null;
    }
    return () => {
      if (unblock.current) {
        unblock.current();
      }
    };
  }, [when, history, message]);
  useBeforeunload(() => {
    if ((typeof when === 'function' && when()) || (typeof when === 'boolean' && when)) {
      return message;
    }
  });
}

export default useBeforeUnload;
