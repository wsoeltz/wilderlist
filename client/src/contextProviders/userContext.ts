import axios from 'axios';
import {createContext, useEffect, useState} from 'react';
import { User } from '../types/graphQLTypes';

export const UserContext = createContext<User | null>(null);

export const useQueryLoggedInUser = () => {
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
