import React, { useEffect, useState } from 'react';
import { Loading } from '../../ui/Loading';
import Link from 'next/link';
import { ContentPin, InteractPin, LovePin } from '../../ContentPin';
import { AvatarImage } from '../../AvatarImage';
import { LocalIcon, LocalSVG } from '../../svg/LocalSVG';
import { Gender } from '../../../models/LivingEntity';
import { PatronType } from '../../../models/Patron';
import { useProfile } from '../../../providers/ProfileProvider';
import {
  fetchOffer,
  PatronisingRequirementDefinition,
  PatronOffer,
  PatronRequirementDefinition
} from '../../../models/PatronOffer';
import { format } from 'date-fns';

export const OfferView = React.memo(({ offerId }: { offerId: string }) => {
  enum FetchState {
    Fetching,
    Found,
    NotFound
  }

  const userProfile = useProfile();
  const [offer, setOffer] = useState<PatronOffer | undefined>(undefined);
  const [state, setState] = useState<FetchState>(FetchState.Fetching);

  useEffect(() => {
    async function fetch() {
      console.log('Fetching offer: ' + offerId);
      const offer = await fetchOffer(offerId);
      setOffer(offer);
      setState(offer ? FetchState.Found : FetchState.NotFound);
    }

    fetch();
  }, [offerId]);

  function age(offer: PatronOffer) {
    const y = new Date().getFullYear() - offer.birthDate.getFullYear();
    return y < 1 ? 1 : y;
  }

  function df(date: Date) {
    function join(t: any, a: any, s: any) {
      function format(m: any) {
        let f = new Intl.DateTimeFormat('pl', m);
        return f.format(t);
      }

      return a.map(format).join(s);
    }

    let a = [{ day: 'numeric' }, { month: 'long' }, { year: 'numeric' }];
    let s = join(date, a, '-');

    return s;
    // return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
  }

  function wholeAmm() {
    const tf = offer?.timeFrames;
    if (!tf) return 0;
    const x = tf.hours.to - tf.hours.from;
    return (x < 0 ? -x : x) * (offer?.paymentPerHour || 1);
  }

  if (state == FetchState.NotFound) return <div className='text-center'>Offer with id: '{offerId}' not found</div>;
  if (state == FetchState.Fetching || !offer) return <Loading>Fetching offer...</Loading>;
  if (offer.hidden) return <>
    <div className='text-center'>To ogłoszenie zostało wycofane!</div>
    <div className='relative'>
      <div className='absolute flex flex-row-reverse w-full'>
        {userProfile.profile_id === offer.profile_id && <div className='mr-10'>
          <Link href={offerId + '/edit'}>
            <button>
              <InteractPin>
                <span className='text-white'>Edit</span>
              </InteractPin>
            </button>
          </Link>
        </div>}
      </div>
    </div>
  </>;
  return <div className='px-2 md:px-8 mb-4'>
    <div className='relative'>
      <div className='absolute flex flex-row-reverse w-full'>
        {userProfile.profile_id === offer.profile_id && <div className=''>
          <Link href={offerId + '/edit'}>
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
      <AvatarImage url={offer.avatar} raw />
    </div>
    <div className='flex justify-center'>
        <span className='mt-2 font-bold text-xl tracking-tight'>
          {offer.title}
        </span>
    </div>
    <div className='flex justify-center'>
        <span className='mt-2 text-2xl italic flex items-center'>
          <span className='mr-2'>{age(offer)}</span>
          <ContentPin>
            <LocalSVG icon={offer.gender === Gender.Male ? LocalIcon.Male : LocalIcon.Female} size={8} />
          </ContentPin>
          <ContentPin>
            <LocalSVG icon={offer.type === PatronType.Animal ? LocalIcon.Animals : LocalIcon.Children} size={8} />
          </ContentPin>
        </span>
    </div>

    <hr className='border-thirst my-4' />

    <div className='grid grid-cols-2'>
      <div className='text-xs md:text-sm'>
        <ContentPin className='px-4'>
          <LocalSVG icon={offer.available ? LocalIcon.Done : LocalIcon.Close} size={8}
                    fill={offer.available ? '#FF3169' : 'red'} />
          <span className='text-lg font-normal italic'>
            {offer.available ? 'Dostępna' : 'Nie aktualna'}
          </span>
        </ContentPin>
        <div className='ml-2 mt-1'>
          {offer.timeFrames.date.to ? (<div>
            od {df(offer.timeFrames.date.from)} do {df(offer.timeFrames.date.to)}
          </div>) : (<div>
            w dniu {df(offer.timeFrames.date.from)}
          </div>)}
        </div>
        <div className='ml-2 mt-1'>
          Godziny: od {offer.timeFrames.hours.from} do {offer.timeFrames.hours.to}
        </div>
        <div className='ml-2 mt-1 font-bold'>
          {offer.paymentPerHour} zł / godz {wholeAmm() ? `(${wholeAmm()} zł / sesja)` : ''}
        </div>
      </div>
      <div className='text-xs md:text-sm'>
        <div className='flex justify-end items-center'>
          <span className='mr-2'>
            {offer.phoneNumber}
          </span>
          <a href={'tel:' + offer.phoneNumber} className='hover:border-none'>
            <InteractPin>
              <LocalSVG icon={LocalIcon.Call} size={8} fill='white' />
            </InteractPin>
          </a>
        </div>
        <div className='flex justify-end items-center'>
          <span className='mr-2 break-all'>
            {offer.email}
          </span>
          <a href={'mailto:' + offer.email} className='hover:border-none'>
            <InteractPin>
              <LocalSVG icon={LocalIcon.Email} size={8} fill='white' />
            </InteractPin>
          </a>
        </div>
        <div className='flex justify-end m-2'>
          {offer.localization.postalCode} {offer.localization.city}, {offer.localization.street}
        </div>
      </div>
    </div>

    {offer.requirements.patron && <div>

      <hr className='border-thirst my-4' />

      <div className='text-xs md:text-sm'>
        Wymagania od opiekuna:
        <div className='ml-4 list-disc'>
          {offer.requirements.patron.map(req => (<li key={req}>
            {PatronRequirementDefinition[req]?.label}
          </li>))}
        </div>
      </div>
    </div>}

    {offer.requirements.patronising && <div>

      <hr className='border-thirst my-4' />

      <div className='text-xs md:text-sm'>
        Obowiązki:
        <div className='ml-4 list-disc'>
          {offer.requirements.patronising.map(req => (<li key={req}>
            {PatronisingRequirementDefinition[req]?.label}
          </li>))}
        </div>
      </div>
    </div>}

    {offer.description && (<>
      <hr className='border-thirst my-4' />

      <div className='text-xs md:text-sm break-normal whitespace-pre-line'>
        {offer.description}
      </div>
    </>)}
  </div>;
});
