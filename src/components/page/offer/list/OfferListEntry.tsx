import Link from 'next/link';
import { LocalIcon, LocalSVG } from '../../../svg/LocalSVG';
import { Gender } from '../../../../models/LivingEntity';
import { PatronType } from '../../../../models/Patron';
import { InteractPin, LovePin } from '../../../ContentPin';
import React from 'react';
import { PatronOffer } from '../../../../models/PatronOffer';

interface ListEntryProps {
  offer: PatronOffer;
}

export const OfferListEntry = (props: ListEntryProps) => {
  const { offer } = props;

  function Avatar() {
    const s = 120;
    const size = s + 'px';
    const sizeImg = (120 - 6) + 'px';

    return <div className={`bg-thirst rounded-full mt-2`} style={{
      boxShadow: '0px 3px 0px rgba(255, 201, 71, 0.33)',
      width: size,
      height: size
    }}>
      <div className='px-1 pt-1' style={{
        padding: '4px 3px 0px 3px'
      }}>
        <img
          className='rounded-full mx-auto'
          style={{
            width: sizeImg,
            height: sizeImg
          }}
          src={offer.avatar}
          alt='profile'
        />
      </div>
    </div>;
  }

  function age() {
    const y = new Date().getFullYear() - offer.birthDate.getFullYear();
    return y < 1 ? 1 : y;
  }

  function payments() {
    if (!offer.paymentPerHour) return 'za darmo'
    return offer.paymentPerHour + 'zł / godz';
  }

  return <div className='border-t border-thirst py-2'>
    <div className='flex justify-between'>

      <div>
        <Link href={'/offer/' + offer.offer_id}>
          <a>
            <Avatar />
          </a>
        </Link>
      </div>

      <div className='mx-5 w-full'>
        <Link href={'/offer/' + offer.offer_id}>
          <a>
            <h4 className='text-lg font-bold flex'>
              <div className='inline mr-1'>
                <LocalSVG icon={offer.type === PatronType.Animal ? LocalIcon.Animals : LocalIcon.Children} size={6} />
              </div>
              <div className='inline mr-1 '>
                <LocalSVG icon={offer.gender === Gender.Male ? LocalIcon.Male : LocalIcon.Female} size={6} />
              </div>
              {offer.title}
            </h4>
            <div className='text-sm font-bold'>
              {age()} lat
            </div>
          </a>
        </Link>
        <div className='text-xs'>
          {offer.localization.city}, {offer.localization.street}
        </div>
        <div className='text-xs'>
          {/*{TranslatePatronTime(offer.patron.time)}*/}
        </div>
        <div className='text-xs'>
          <span className='font-bold'>
            {/*{'Zobacz stawke >'}*/}
            {payments()}
          </span>
        </div>

        <div className='flex justify-end'>
          <div>
            <a href={'mailto:' + offer.email} className='hover:border-none'>
              <InteractPin heightOuter={8} heightInner={6} minWidth={3}>
                <LocalSVG icon={LocalIcon.Email} size={6} fill='white' />
              </InteractPin>
            </a>
            <a href={'tel:' + offer.phoneNumber} className='hover:border-none'>
              <InteractPin heightOuter={8} heightInner={6} minWidth={3}>
                <LocalSVG icon={LocalIcon.Call} size={6} fill='white' />
              </InteractPin>
            </a>
          </div>
          {/*<div>*/}
          {/*  <LovePin heightOuter={8} heightInner={6} minWidth={3} />*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  </div>;
};