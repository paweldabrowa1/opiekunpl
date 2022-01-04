// @ts-nocheckXXX

import React, { ReactNode, useContext, useState } from 'react';
import { UserProvider, useUser as userAuth0User } from '@auth0/nextjs-auth0';
import { callbacks } from '../lib/RealmClient';
// import { useRootStore } from 'store/Context';
import { AuthSessionExpiredModal } from '../components/auth/AuthSessionExpiredModal';
import { Auth0RemappedUser } from '../models/auth0/Auth0RemappedUser';
import ProcessingPage from '../components/ui/page/ProcessingPage';
import AuthSignInPage from '../components/auth/AuthSignInPage';
import ErrorPage from '../components/ui/page/ErrorPage';

const Auth0RemappedUserContext = React.createContext(new Auth0RemappedUser(null));

const Auth0RemappedUserProviderRaw = ({ children }: { children: ReactNode }) => {
  const { user: auth0User, error, isLoading } = userAuth0User();
  const [sessionExpired, setSessionExpired] = useState(false);

  callbacks.onAccessTokenExpired = () => {
    console.warn('Access token expired. Logging out.');
    setSessionExpired(true);
  };

  if (isLoading) return <ProcessingPage>Loading...</ProcessingPage>;
  if (error) return <ErrorPage>{error.message}</ErrorPage>;

  function SessionExpiredModal({ awesomeUser }: { awesomeUser: Auth0RemappedUser }) {
    // const dataStore = useRootStore();

    return (
      <AuthSessionExpiredModal onClick={() => {
        // dataStore.clearStores();
        console.log('xxx');
        awesomeUser.logout();
      }} />
    );
  }

  if (auth0User) {
    const awesomeUser = new Auth0RemappedUser(auth0User);

    return (
      <Auth0RemappedUserContext.Provider value={awesomeUser}>
        {children}
        {sessionExpired && <SessionExpiredModal awesomeUser={awesomeUser} />}
      </Auth0RemappedUserContext.Provider>
    );
  } else {
    return <AuthSignInPage />;
  }
};

// extended with Auth0 user provider
const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <Auth0RemappedUserProviderRaw>{children}</Auth0RemappedUserProviderRaw>
    </UserProvider>
  );
};

export default AuthProvider;

export const useUser = () => useContext(Auth0RemappedUserContext);
