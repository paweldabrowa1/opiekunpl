import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { InteractPin } from '../../ContentPin';
import { useProfile } from '../../../providers/ProfileProvider';
import { EditPatronOfferForm } from './EditPatronOfferForm';
import { fetchOffer, PatronOffer } from '../../../models/PatronOffer';
import { Loading } from '../../ui/Loading';

export const OfferEdit = React.memo(({ offerId }: { offerId: string }) => {
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

  if (state == FetchState.NotFound) return <div className='text-center'>Offer with id: '{offerId}' not found</div>;
  if (state == FetchState.Fetching || !offer) return <Loading>Fetching offer...</Loading>;

  return <div className='px-8 mb-4'>
    <div className='relative'>
    <div className='absolute flex flex-row-reverse w-full'>
      <div className=''>
        <Link href={offerId}>
          <button>
            <InteractPin>
              <span className='text-white mx-2'>Back to view</span>
            </InteractPin>
          </button>
        </Link>
      </div>
    </div>
    </div>

    <div className='flex justify-center mt-4'>
      <div className='w-full lg:w-3/5'>
        <EditPatronOfferForm offer={offer} />
      </div>
    </div>
  </div>;
});
