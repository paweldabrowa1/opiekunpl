import { Profile } from '../../../../models/Profile';
import Link from 'next/link';
import { LocalIcon, LocalSVG } from '../../../svg/LocalSVG';
import { Gender } from '../../../../models/LivingEntity';
import { PatronPaymentType, TranslatePatronTime } from '../../../../models/Patron';
import { InteractPin, LovePin } from '../../../ContentPin';
import React from 'react';

interface ListEntryProps {
  profile: Profile;
}

export const ProfileListEntry = (props: ListEntryProps) => {
  const { profile } = props;

  function Avatar() {
    const size = '120px';

    return <div className={`bg-thirst rounded-full mt-2`} style={{
      boxShadow: '0px 3px 0px rgba(255, 201, 71, 0.33)',
      width: size,
      height: size
    }}>
      <div className='px-1 pt-1' style={{
        padding: '4px 3px 0px 3px'
      }}>
        <img
          className='h-full w-full rounded-full mx-auto'
          src={profile.avatar}
          alt='profile'
        />
      </div>
    </div>;
  }

  function age() {
    const y = new Date().getFullYear() - profile.birthDate.getFullYear();
    return y < 1 ? 1 : y;
  }

  function payments() {
    if (profile.patron.payment.type === PatronPaymentType.NotSet) return 'Nie ustawiony'
    if (!profile.patron.payment.amount || profile.patron.payment.amount <= 0) return 'Pomaga za darmo'
    return profile.patron.payment.amount + 'zł / godz';
  }

  return <div className='border-t border-thirst py-2'>
    <div className='flex justify-between'>

      <div>
        <Link href={'/profile/' + profile.profile_id}>
          <a>
            <Avatar />
          </a>
        </Link>
      </div>

      <div className='mx-5 w-full'>
        <Link href={'/profile/' + profile.profile_id}>
          <a>
            <h4 className='text-lg font-bold flex'>
              {profile.name.first}
              <div className='inline'>
                <LocalSVG icon={profile.gender === Gender.Male ? LocalIcon.Male : LocalIcon.Female} size={6} />
              </div>
            </h4>
            <div className='text-sm font-bold'>
              {age()} lat
            </div>
          </a>
        </Link>
        <div className='text-xs'>
          {profile.localization.city}, {profile.localization.street}
        </div>
        <div className='text-xs'>
          {TranslatePatronTime(profile.patron.time)}
        </div>
        <div className='text-xs'>
          <span className='font-bold'>
            {/*{'Zobacz stawke >'}*/}
            {payments()}
          </span>
        </div>

        <div className='flex justify-between'>
          <div>
            <a href={'mailto:' + profile.email} className='hover:border-none'>
              <InteractPin heightOuter={8} heightInner={6} minWidth={3}>
                <LocalSVG icon={LocalIcon.Email} size={6} fill='white' />
              </InteractPin>
            </a>
            <a href={'tel:' + profile.phoneNumber} className='hover:border-none'>
              <InteractPin heightOuter={8} heightInner={6} minWidth={3}>
                <LocalSVG icon={LocalIcon.Call} size={6} fill='white' />
              </InteractPin>
            </a>
          </div>
          <div>
            {/*<LovePin heightOuter={8} heightInner={6} minWidth={3} />*/}
          </div>
        </div>
      </div>
    </div>
  </div>;
};