import React, { useEffect, useState } from 'react';
import { fetchProfile, Profile, ProfileType } from '../../../models/Profile';
import { Loading } from '../../ui/Loading';
import Link from 'next/link';
import { ContentPin, InteractPin, LovePin } from '../../ContentPin';
import { AvatarImage } from '../../AvatarImage';
import { LocalIcon, LocalSVG } from '../../svg/LocalSVG';
import { Gender } from '../../../models/LivingEntity';
import { PatronPaymentType, TranslatePatronTime } from '../../../models/Patron';
import { useProfile } from '../../../providers/ProfileProvider';

export const ProfileView = React.memo(({ profileId }: { profileId: string }) => {
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
      console.log('Fetching profile: ' + profileId);
      const profile = await fetchProfile(undefined, profileId);
      setProfile(profile);
      setState(profile ? FetchState.Found : FetchState.NotFound);
    }

    fetch();
  }, [profileId]);

  function age(profile: Profile) {
    const y = new Date().getFullYear() - profile.birthDate.getFullYear();
    return y < 1 ? 1 : y;
  }

  function payments() {
    if (!profile) return '';
    if (profile.patron.payment.type === PatronPaymentType.NotSet) return 'Nie ustawiony'
    if (!profile.patron.payment.amount || profile.patron.payment.amount <= 0) return 'Pomaga za darmo'
    return profile.patron.payment.amount + 'zł / godz';
  }

  if (state == FetchState.NotFound) return <div className='text-center'>Profile with id: '{profileId}' not found</div>;
  if (state == FetchState.Fetching || !profile) return <Loading>Fetching profile...</Loading>;
  return <div className='px-2 md:px-8 mb-4'>
    <div className='relative'>
      <div className='absolute flex flex-row-reverse w-full'>
        {userProfile.profile_id === profileId && <div className=''>
          <Link href={profileId + '/edit'}>
            <button>
              <InteractPin>
                <span className='text-white'>Edit</span>
              </InteractPin>
            </button>
          </Link>
        </div>}
      </div>
    </div>
    <div className='flex justify-center'>
      <AvatarImage url={profile.avatar} raw />
    </div>
    <div className='flex justify-center'>
        <span className='mt-2 uppercase font-bold text-xl tracking-tight'>
          {profile.name.first} {profile.name.second}
        </span>
    </div>
    <div className='flex justify-center'>
        <span className='mt-2 text-2xl italic flex items-center'>
          <span className='mr-2'>{age(profile)}</span>
          <ContentPin>
            <LocalSVG icon={profile.gender === Gender.Male ? LocalIcon.Male : LocalIcon.Female} size={8} />
          </ContentPin>
        </span>
    </div>

    <div className='flex justify-between items-center mt-3'>
      {profile.type === ProfileType.Nanny ? <>
        <div>
          <ContentPin>
            <LocalSVG icon={LocalIcon.Children} size={8} />
          </ContentPin>

          <ContentPin>
            <LocalSVG icon={LocalIcon.Animals} size={8} />
          </ContentPin>
        </div>

        <div>
          {/*<LovePin>1024</LovePin>*/}
        </div>
      </> : <ContentPin className='px-4 italic text-lg'>Uzytkownik</ContentPin>}
    </div>

    {profile.type === ProfileType.Nanny && <>
      <hr className='border-thirst my-4' />

      <div className='flex justify-between items-center mt-3'>
        <div>
          <ContentPin className='px-4'>
            <LocalSVG icon={profile.available ? LocalIcon.Done : LocalIcon.Close} size={8}
                      fill={profile.available ? '#FF3169' : 'red'} />
            <span className='text-lg font-normal italic'>
            {profile.available ? 'Dostępny' : 'Nie dostępny'}
          </span>
          </ContentPin>
        </div>

        <div>
          <a href={'mailto:' + profile.email} className='hover:border-none'>
            <InteractPin>
              <LocalSVG icon={LocalIcon.Email} size={8} fill='white' />
            </InteractPin>
          </a>
          <a href={'tel:' + profile.phoneNumber} className='hover:border-none'>
            <InteractPin>
              <LocalSVG icon={LocalIcon.Call} size={8} fill='white' />
            </InteractPin>
          </a>
        </div>
      </div>

      <div className='text-xs md:text-sm'>

        <div className='flex justify-between items-center mt-3'>
          <div>
            {TranslatePatronTime(profile.patron.time)}
          </div>

          <div>
            {profile.localization.postalCode} {profile.localization.city}, {profile.localization.street}
          </div>
        </div>

        {/*<div className='my-2'>*/}
        {/*  Grafik:*/}
        {/*  <span className='font-bold mx-2'>{'Sprawdź terminy >'}</span>*/}
        {/*</div>*/}

        <div className='my-2'>
          Wynagrodzenie:
          <span className='font-bold mx-2'>
            {/*{'Zobacz stawke >'}*/}
            {payments()}
          </span>
        </div>

        {/*<div className='my-2'>*/}
        {/*  <div className='font-bold p-2 mr-2 bg-love italic rounded-full w-6 h-6 text-center inline-block'>*/}
        {/*    <div className='flex justify-center items-center text-white h-full'>*/}
        {/*      9*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  Referencje:*/}
        {/*  <span className='font-bold mx-2'>{'Pokaz >'}</span>*/}
        {/*</div>*/}
      </div>
    </>}

    {profile.description && (<>
      <hr className='border-thirst my-4' />

      <div className='text-xs md:text-sm break-normal whitespace-pre-line'>
        {profile.description}
      </div>
    </>)}
  </div>;
});
