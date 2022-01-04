import { PatronData } from './Patron';
import { LivingEntity } from './LivingEntity';
import { Contact } from './Contact';
import { simpleFetcher } from '../lib/RealmClientUtil';
import { PatronOffer } from './PatronOffer';

export interface Profile extends LivingEntity, Contact {
  auth_id: string;
  profile_id: string;

  type: ProfileType;
  patron: PatronData;

  avatar: string;

  registerDate: Date;
  available: boolean;
}

export enum ProfileType {
  Member = 'member',
  Nanny = 'nanny'
}

export async function fetchProfile(
  auth_id?: string, profile_id?: string
): Promise<Profile | undefined> {
  const fields = [];

  if (auth_id) fields.push(`auth_id: "${auth_id}"`);
  if (profile_id) fields.push(`profile_id: "${profile_id}"`);

  // Xanguage=GraphQL
  const GET_PROFILE = `
      query {
          profile(query: {${fields.join(', ')}}) {
              auth_id
              profile_id
              type

              patron {
                  time
                  type

                  payment {
                      type
                      amount
                  }
              }

              registerDate
              
              available
              
              avatar


              email
              phoneNumber
              localization {
                  postalCode
                  city
                  street
                  countryCode
              }


              name {
                  first
                  second
              }

              gender

              birthDate
              description
          }
      }
  `;

  const response = await simpleFetcher({
    query: GET_PROFILE
  });

  const profile = response.data.profile;

  if (response && response.status === 200 && profile) {
    profile.birthDate = new Date(profile.birthDate);
    profile.registerDate = new Date(profile.registerDate);
    return profile;
  }

  return undefined;
}

export async function fetchProfilesList(query: string): Promise<Profile[] | undefined> {
  const PQ = `(${query ? query + ',' : ''} limit: 0)`;

  // Xanguage=GraphQL
  const GET_PROFILES = `
      query {
          profiles ${PQ} {
              auth_id
              profile_id
              type
              
              available

              patron {
                  time
                  type
              }

              avatar

              email
              phoneNumber
              
              localization {
                  city
                  street
              }

              patron {
                  time
                  type

                  payment {
                      type
                      amount
                  }
              }

              name {
                  first
              }

              gender
              
              birthDate
          }
      }
  `;

  const response = await simpleFetcher({
    query: GET_PROFILES
  });

  const profiles = response.data.profiles;

  if (response && response.status === 200 && profiles) {
    for (let profile of profiles) {
      profile.birthDate = new Date(profile.birthDate);
    }
    return profiles;
  }

  return undefined;
}


// language=GraphQL
const CREATE_PROFILE = `
    mutation ($profile: ProfileInsertInput!) {
        insertOneProfile(data: $profile) {
            _id
        }
    }
`;

export async function createProfile(profile: Profile): Promise<boolean> {
  const response = await simpleFetcher({
    query: CREATE_PROFILE,
    queryVariables: {
      profile
    }
  });

  if (response && response.status === 200 && response.data.insertOneProfile._id) {
    return true;
  }

  console.log(response);

  return false;
}
export async function updateProfile(profile: Profile): Promise<boolean> {

  // language=GraphQL
  const UPDATE_PROFILE = `
      mutation ($id: String, $profile: ProfileUpdateInput!) {
          updateOneProfile(query: {profile_id: $id}, set: $profile) {
              _id
          }
      }
  `;

  const response = await simpleFetcher({
    query: UPDATE_PROFILE,
    queryVariables: {
      id: profile.profile_id,
      profile: profile
    }
  });

  if (response && response.status === 200 && response.data.updateOneProfile._id) {
    return true;
  }

  console.log(response);

  return false;
}
