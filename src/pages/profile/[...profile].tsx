import { Main } from '../../templates/Main';
import { Meta } from '../../layout/Meta';
import React from 'react';
import { ProfileView } from '../../components/page/profile/ProfileView';
import { ProfileEdit } from '../../components/page/profile/ProfileEdit';

enum State {
  View,
  Edit
}

const ProfilePage = ({ profileId, subpage }: { profileId: string, subpage: string }) => {
  // const user = useUser();
  // const userProfile = useProfile();

  const state = subpage === 'edit' ? State.Edit : State.View;


  return (
    <Main
      meta={
        <Meta
          title='Profile'
          description='User profile'
        />
      }
    >
      {state === State.Edit && <ProfileEdit profileId={profileId} />}
      {state === State.View && <ProfileView profileId={profileId} />}
    </Main>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: any) {
  const [profileId, subpage] = context.params.profile;

  return {
    props: {
      profileId: profileId,
      subpage: subpage ?? null
    }
  };
}