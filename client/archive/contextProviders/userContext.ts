import {createContext, useState, useEffect} from 'react';
import { User } from '../types/graphQLTypes';
import axios from 'axios';

export default createContext<User | null>(null);

export const useLoggedInUser = () => {
  const [user, setUser] = useState<User| null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/current_user');
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return user;
};
