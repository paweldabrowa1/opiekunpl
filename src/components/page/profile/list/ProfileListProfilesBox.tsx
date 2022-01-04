import FadeIn from 'react-fade-in';
import { Loading } from '../../../ui/Loading';
import { ProfileListEntry } from './ProfileListEntry';
import React from 'react';
import { Profile } from '../../../../models/Profile';

interface Props {
  profiles: Profile[]
  profilesLoading: boolean
}

export function ProfileListProfilesBox(props: Props) {

  return <div className='col-span-3'>
    <FadeIn delay={100}>
      <h2 className='text-xl font-bold mt-2'>
        Opiekuni
      </h2>
      <h3 className='text-xs'>
        Znaleziono {props.profiles.length} opiekunów
      </h3>

      <div className='mt-4'>
        {props.profilesLoading ? <Loading inline> Ladowanie profili... </Loading> :
          props.profiles.map(function(profile) {
            return <ProfileListEntry key={profile.profile_id} profile={profile} />;
          })
        }
      </div>
    </FadeIn>
  </div>;
}