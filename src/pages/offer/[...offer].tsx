import { Main } from '../../templates/Main';
import { Meta } from '../../layout/Meta';
import React from 'react';
import { OfferEdit } from '../../components/page/offer/OfferEdit';
import { OfferView } from '../../components/page/offer/OfferView';

enum State {
  View,
  Edit
}

const ProfilePage = ({ offerId, subpage }: { offerId: string, subpage: string }) => {
  // const user = useUser();
  // const userProfile = useProfile();

  const state = subpage === 'edit' ? State.Edit : State.View;


  return (
    <Main
      meta={
        <Meta
          title='Oferta'
          description='Przegladanie oferty'
        />
      }
    >
      {state === State.Edit && <OfferEdit offerId={offerId} />}
      {state === State.View && <OfferView offerId={offerId} />}
    </Main>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: any) {
  const [offerId, subpage] = context.params.offer;

  return {
    props: {
      offerId: offerId,
      subpage: subpage ?? null
    }
  };
}