import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { InteractPin } from '../../ContentPin';
import { useProfile } from '../../../providers/ProfileProvider';
import { EditProfileForm } from './EditProfileForm';
import { fetchOffer, PatronOffer } from '../../../models/PatronOffer';
import { Loading } from '../../ui/Loading';
import { EditPatronOfferForm } from '../offer/EditPatronOfferForm';
import { fetchProfile, Profile } from '../../../models/Profile';

export const ProfileEdit = React.memo(({ profileId }: { profileId: string }) => {

  enum FetchState {
    Fetching,
    Found,
    NotFound
  }

  const userProfile = useProfile();

  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [state, setState] = useState<FetchState>(FetchState.Fetching);

  useEffect(() => {
    async function fetch() {
      console.log('Fetching profileId: ' + profileId);
      const profile = await fetchProfile(undefined, profileId);
      setProfile(profile);
      setState(profile ? FetchState.Found : FetchState.NotFound);
    }

    fetch();
  }, [profileId]);

  if (state == FetchState.NotFound) return <div className='text-center'>Profile with id: '{profileId}' not found</div>;
  if (state == FetchState.Fetching || !profile) return <Loading>Fetching profile...</Loading>;

  return <div className='px-8 mb-4'>
    <div className='absolute flex flex-row-reverse w-full'>
      <div className='mr-10 md:mr-20'>
        <Link href={profileId}>
          <button>
            <InteractPin>
              <span className='text-white mx-2'>Back to view</span>
            </InteractPin>
          </button>
        </Link>
      </div>
    </div>

    <div className='flex justify-center mt-4'>
      <div className='w-full lg:w-3/5'>
        <EditProfileForm profile={profile}/>
      </div>
    </div>
  </div>;
});
