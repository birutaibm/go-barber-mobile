import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
};

interface AuthState {
  token: string;
  user: User;
}

interface SignInInputDTO {
  email: string;
  password: string;
}

type SignInOutputDTO = Promise<void>;

interface AuthContext {
  user: User;
  loading: boolean;
  signIn(input: SignInInputDTO): SignInOutputDTO;
  signOut(): void;
}

const Context = createContext<AuthContext>({} as AuthContext);

export function useAuth(): AuthContext {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export const AuthProvider: React.FC = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStorageData() {
      const [token, user] = await AsyncStorage.multiGet(['@GoBarber:token', '@GoBarber:user']);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setData({token: token[1], user: JSON.parse(user[1])});
      }

      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async ({email, password}) => {
    const {data} = await api.post('sessions', {email, password});

    const {token, user} = data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({token, user})
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  return (
    <Context.Provider value={{user: data.user, loading, signIn, signOut}}>
      {children}
    </Context.Provider>
  );
};
