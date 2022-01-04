import FadeIn from 'react-fade-in';
import { Loading } from '../../../ui/Loading';
import { OfferListEntry } from './OfferListEntry';
import React from 'react';
import { Profile } from '../../../../models/Profile';
import { PatronOffer } from '../../../../models/PatronOffer';

interface Props {
  offers: PatronOffer[]
  profilesLoading: boolean
}

export function OfferListOffersBox(props: Props) {

  return <div className='col-span-3'>
    <FadeIn delay={100}>
      <h2 className='text-xl font-bold mt-2'>
        Oferty
      </h2>
      <h3 className='text-xs'>
        Znaleziono {props.offers.length} ofert
      </h3>

      <div className='mt-4'>
        {props.profilesLoading ? <Loading inline> Ladowanie ofert... </Loading> :
          props.offers.map(function(offer) {
            return <OfferListEntry key={offer.offer_id} offer={offer} />;
          })
        }
      </div>
    </FadeIn>
  </div>;
}