import { Main } from '../../templates/Main';
import { Meta } from '../../layout/Meta';
import React, { useEffect, useState } from 'react';
import { fetchProfilesList, Profile } from '../../models/Profile';
import { GraphQLQueryCreator } from '../../controls/gql/GraphQLQueryCreator';
import { GraphQLQueryPart, GraphQLQueryPartType } from '../../controls/gql/GraphQLQueryPart';
import { useProfile } from '../../providers/ProfileProvider';
import { ProfileListFilterBox } from '../../components/page/profile/list/ProfileListFilterBox';
import { ProfileListProfilesBox } from '../../components/page/profile/list/ProfileListProfilesBox';
import { OfferListOffersBox } from '../../components/page/offer/list/OfferListOffersBox';
import { OfferListFilterBox } from '../../components/page/offer/list/OfferListFilterBox';
import { fetchOfferList, PatronOffer } from '../../models/PatronOffer';

const List = () => {

  const profile = useProfile();

  const offersQueryCreator = new GraphQLQueryCreator([
    new GraphQLQueryPart(GraphQLQueryPartType.Boolean, 'hidden'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'gender'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'type'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'city', 'localization.city'),
    // new GraphQLQueryPart(GraphQLQueryPartType.String, 'patronTime', 'patron.time'),
    // new GraphQLQueryPart(GraphQLQueryPartType.Simple, 'patronPriceMin', 'patron.payment.amount_gte'),
    // new GraphQLQueryPart(GraphQLQueryPartType.Simple, 'patronPriceMax', 'patron.payment.amount_lte'),
    new GraphQLQueryPart(GraphQLQueryPartType.Date, 'birthDateMin',  'birthDate_lte'),
    new GraphQLQueryPart(GraphQLQueryPartType.Date, 'birthDateMax', 'birthDate_gte')
  ]);

  const [offersLoading, setOffersLoading] = useState<boolean>(false);
  const [offers, setOffers] = useState<PatronOffer[]>([]);
  const [offersQueryValues, setOffersQueryValues] = useState<any>({
    'hidden': 'false',
    'gender': '',
    'city': profile.localization.city,
    'patronTime': '',
    'patronPriceMin': '',
    'patronPriceMax': '',
    'birthDateMin': '',
    'birthDateMax': ''
  });
  const [offersQuery, setOffersQuery] = useState<string>(offersQueryCreator.query(
    offersQueryValues
  ));

  useEffect(() => {
    async function fetch() {
      const offers = await fetchOfferList(offersQuery);
      setOffers(offers || []);
      setOffersLoading(false);
    }

    fetch();
    setOffersLoading(true);
  }, [offersQuery]);

  return (
    <Main
      meta={
        <Meta
          title='Lista ofert opieki'
          description=''
        />
      }
    >
      <div className={'mx-10 my-4'}>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-x-4'>
          <OfferListFilterBox
            offersQueryValues={offersQueryValues}
            offersQueryCreator={offersQueryCreator}
            setOffersQueryValues={setOffersQueryValues}
            setOffersQuery={setOffersQuery}
          />
          <OfferListOffersBox
            offers={offers}
            profilesLoading={offersLoading}
          />
        </div>
      </div>
    </Main>
  );
};

export default List;
