import { Main } from '../../templates/Main';
import { Meta } from '../../layout/Meta';
import React, { useEffect, useState } from 'react';
import { fetchProfilesList, Profile, ProfileType } from '../../models/Profile';
import { GraphQLQueryCreator } from '../../controls/gql/GraphQLQueryCreator';
import { GraphQLQueryPart, GraphQLQueryPartType } from '../../controls/gql/GraphQLQueryPart';
import { useProfile } from '../../providers/ProfileProvider';
import { ProfileListFilterBox } from '../../components/page/profile/list/ProfileListFilterBox';
import { ProfileListProfilesBox } from '../../components/page/profile/list/ProfileListProfilesBox';
import { PatronPaymentType } from '../../models/Patron';

const List = () => {

  const profile = useProfile();

  const profilesQueryCreator = new GraphQLQueryCreator([
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'onlyNanny', 'type'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'onlyPatronsWithPaymentsSet', 'patron.payment.type_ne'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'gender'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'city', 'localization.city'),
    new GraphQLQueryPart(GraphQLQueryPartType.String, 'patronTime', 'patron.time'),
    new GraphQLQueryPart(GraphQLQueryPartType.Simple, 'patronPriceMin', 'patron.payment.amount_gte'),
    new GraphQLQueryPart(GraphQLQueryPartType.Simple, 'patronPriceMax', 'patron.payment.amount_lte'),
    new GraphQLQueryPart(GraphQLQueryPartType.Date, 'birthDateMin',  'birthDate_lte'),
    new GraphQLQueryPart(GraphQLQueryPartType.Date, 'birthDateMax', 'birthDate_gte')
  ]);

  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesQueryValues, setProfilesQueryValues] = useState<any>({
    'onlyNanny': ProfileType.Nanny,
    'onlyPatronsWithPaymentsSet': PatronPaymentType.NotSet,
    'gender': '',
    'city': profile.localization.city,
    'patronTime': '',
    'patronPriceMin': '',
    'patronPriceMax': '',
    'birthDateMin': '',
    'birthDateMax': ''
  });
  const [profilesQuery, setProfilesQuery] = useState<string>(profilesQueryCreator.query(
    profilesQueryValues
  ));

  useEffect(() => {
    async function fetch() {
      const profiles = await fetchProfilesList(profilesQuery);
      setProfiles(profiles || []);
      setProfilesLoading(false);
    }

    fetch();
    setProfilesLoading(true);
  }, [profilesQuery]);

  return (
    <Main
      meta={
        <Meta
          title='Some title'
          description='Some desc'
        />
      }
    >
      <div className={'mx-10 my-4'}>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-x-4'>
          <ProfileListFilterBox
            profilesQueryValues={profilesQueryValues}
            profilesQueryCreator={profilesQueryCreator}
            setProfilesQueryValues={setProfilesQueryValues}
            setProfilesQuery={setProfilesQuery}
          />
          <ProfileListProfilesBox
            profiles={profiles}
            profilesLoading={profilesLoading}
          />
        </div>
      </div>
    </Main>
  );
};

export default List;
