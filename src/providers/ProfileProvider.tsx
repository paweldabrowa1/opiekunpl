import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { Observer } from 'mobx-react';
import ProcessingPage from '../components/ui/page/ProcessingPage';
import { fetchProfile, Profile } from '../models/Profile';
import { useRootStore } from './RootStoreProvider';
import { useUser } from './AuthProvider';
import { CreateProfilePage } from '../components/page/profile/CreateProfilePage';

export enum ProfileCheckingState {
  Initializing = 'Initializing profile',
  GatheringFromStore = 'Gathering profile from store',
  GatheringFromDatabase = 'Gathering profile from database',
  ProfileNotFound = 'NO-PROFILE',
  OK = 'OK'
}

const ProfileContext = React.createContext<Profile>({} as Profile);

const ProfileProviderRaw = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const store = useRootStore();

  const [cs, setCS] = useState<ProfileCheckingState>(ProfileCheckingState.Initializing);

  useEffect(() => {
    async function fetch() {
      if (cs === ProfileCheckingState.Initializing) {
        setCS(ProfileCheckingState.GatheringFromStore);
        return;
      }

      if (cs === ProfileCheckingState.GatheringFromStore && !store.profileStore.profile) {
        setCS(ProfileCheckingState.GatheringFromDatabase);
        return;
      }

      if (cs === ProfileCheckingState.GatheringFromDatabase) {
        const auth_id = user.user.sub;
        store.profileStore.profile = await fetchProfile(auth_id as string);
      }

      setCS(store.profileStore.profile ? ProfileCheckingState.OK : ProfileCheckingState.ProfileNotFound);
    }

    fetch();
  }, [cs]);

  if (cs === ProfileCheckingState.OK) {
    return (
      <Observer>
        {() => {
          // JAKBY NIE REAGOWAL PROFIL TO WYWALIC TO "toJS" toJS()
          return <ProfileContext.Provider value={store.profileStore.profile as Profile}>
            {children}
          </ProfileContext.Provider>;
        }}
      </Observer>
    );
  }

  if (cs === ProfileCheckingState.ProfileNotFound) {
    return <CreateProfilePage onFulfill={() => {
      setCS(ProfileCheckingState.OK);
    }} />;
  }

  return <ProcessingPage>{cs}</ProcessingPage>;
};

// extended with Auth0 user provider
const ProfileProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <ProfileProviderRaw>{children}</ProfileProviderRaw>
    </UserProvider>
  );
};

export default ProfileProvider;

export const useProfile = () => useContext(ProfileContext);
