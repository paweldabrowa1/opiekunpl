import { PatronType } from './Patron';
import { LivingEntity } from './LivingEntity';
import { Contact } from './Contact';
import { simpleFetcher } from '../lib/RealmClientUtil';
import { Profile } from './Profile';

export interface PatronOffer extends LivingEntity, Contact {
  type: PatronType;

  offer_id: string;
  profile_id: string;
  profile?: Profile;

  requirements: {
    patron: PatronRequirement[];
    patronising: PatronisingRequirement[];
  }

  timeFrames: PatronTimeFrames
  title: string

  avatar: string

  hidden: boolean
  available: boolean

  paymentPerHour: number
}

type PRDef = {
  type: PatronType,
  label: string
};

type PRDefMap = { [key: string]: PRDef };

export enum PatronRequirement {
  NotSmoking = 'not_smoking',
  Patient = 'patient',
  Cheap = 'cheap',
  Ambitious = 'ambitious'
}

export const PatronRequirementDefinition: PRDefMap = {
  not_smoking: { type: PatronType.Any, label: 'Nie palący' },
  patient: { type: PatronType.Animal, label: 'Cierpliwy' },
  cheap: { type: PatronType.Any, label: 'Tani' },
  ambitious: { type: PatronType.Child, label: 'Ambitny' }
};

//
// ---------
//

export enum PatronisingRequirement {
  BuyingFood = 'buying_food',
  ClothingChange = 'clothing_change',
  BrushingTheFur = 'brushing_the_fur',
  ScholarTransport = 'scholar_transport',
  GettingOut = 'getting_out',
  Training = 'training'
}

export const PatronisingRequirementDefinition: PRDefMap = {
  buying_food: { type: PatronType.Any, label: 'Zakup żywności' },
  brushing_the_fur: { type: PatronType.Animal, label: 'Czyszczenie futerka' },
  clothing_change: { type: PatronType.Any, label: 'Zmiana ubrania' },
  scholar_transport: { type: PatronType.Child, label: 'Dostarczenie/Odbiór ze szkoły' },
  getting_out: { type: PatronType.Any, label: 'Wyprowandzanie' },
  training: { type: PatronType.Any, label: 'Trenowanie' }
};

export function GetPatronisingRequirementFor(type: PatronType): PRDefMap {
  const defs: PRDefMap = {};

  for (let key of Object.keys(PatronisingRequirementDefinition)) {
    const def = PatronisingRequirementDefinition[key];

    if (!def) continue;

    if (type === def.type || def.type === PatronType.Any) {
      defs[key] = def;
    }
  }

  return defs;
}

export interface PatronTimeFrames {
  date: {
    from: Date;
    to?: Date;
  }

  hours: {
    from: number;
    to: number;
  }
}


export async function fetchOffer(
  offer_id: string
): Promise<PatronOffer | undefined> {
  const fields = [];

  if (offer_id) fields.push(`offer_id: "${offer_id}"`);

  const PQ = `(query: {${fields.join(', ')}})`;

  // xlanguage=GraphQL
  const GET_PROFILE = `
      query {
          offer ${PQ} {
              profile_id {
                  profile_id
                  name {
                      first
                  }
              }
              offer_id
              type
              
              avatar

              paymentPerHour

              email
              phoneNumber
              localization {
                  postalCode
                  city
                  street
                  countryCode
              }
              
              requirements {
                  patron
                  patronising
              }

              timeFrames {
                  date {
                      from
                      to
                  }
                  hours {
                      from
                      to
                  }
              }
              
              available
              hidden

              name {
                  first
                  second
              }

              gender

              birthDate
              description
              title
          }
      }
  `;

  const response = await simpleFetcher({
    query: GET_PROFILE
  });

  const offer = response.data.offer;

  if (response && response.status === 200 && offer) {
    offer.birthDate = new Date(offer.birthDate);
    if(offer.timeFrames.date.from) {
      offer.timeFrames.date.from = new Date(offer.timeFrames.date.from);
    }
    if(offer.timeFrames.date.to) {
      offer.timeFrames.date.to = new Date(offer.timeFrames.date.to);
    }
    offer.profile = offer.profile_id;
    offer.profile_id = offer.profile_id.profile_id;
    return offer;
  }

  return undefined;
}

export async function fetchOfferList(query: string): Promise<PatronOffer[] | undefined> {
  const PQ = `(${query ? query + ',' : ''} limit: 0)`;

  // offers ${PQ} {
  // Xanguage=GraphQL
  const GET_OFFERS = `
      query {
          offers ${PQ} {
              profile_id {
                  profile_id
                  name {
                      first
                  }
              }
              offer_id
              
              type
              paymentPerHour

              email
              phoneNumber
              
              localization {
                  city
                  street
              }

              name {
                  first
              }
              
              title

              gender
              
              birthDate
              avatar
          }
      }
  `;

  const response = await simpleFetcher({
    query: GET_OFFERS
  });

  const offers = response.data.offers;

  if (response && response.status === 200 && offers) {
    for (let offer of offers) {
      offer.birthDate = new Date(offer.birthDate);
      // if(offer.timeFrames.date.from) {
      //   offer.timeFrames.date.from = new Date(offer.timeFrames.date.from);
      // }
      // if(offer.timeFrames.date.to) {
      //   offer.timeFrames.date.to = new Date(offer.timeFrames.date.to);
      // }
      offer.profile = offer.profile_id;
      offer.profile_id = offer.profile_id.profile_id;
    }
    return offers;
  }

  return undefined;
}

export async function createPatronOffer(offer: PatronOffer): Promise<boolean> {

  // language=GraphQL
  const CREATE_OFFER = `
      mutation ($offer: OfferInsertInput!) {
          insertOneOffer(data: $offer) {
              _id
          }
      }
  `;

  const inputOffer = {...offer};
  // @ts-ignore
  inputOffer.profile_id = {link: offer.profile_id};

  console.log(inputOffer);

  const response = await simpleFetcher({
    query: CREATE_OFFER,
    queryVariables: {
      offer: inputOffer
    }
  });

  if (response && response.status === 200 && response.data.insertOneOffer._id) {
    return true;
  }

  console.log(response);

  return false;
}


export async function updatePatronOffer(offer: PatronOffer): Promise<boolean> {

  // language=GraphQL
  const UPDATE_OFFER = `
      mutation ($id: String, $offer: OfferUpdateInput!) {
          updateOneOffer(query: {offer_id: $id},set: $offer) {
              _id
          }
      }
  `;

  const inputOffer = {...offer};
  // @ts-ignore
  inputOffer.profile_id = {link: offer.profile_id};

  console.log(inputOffer);

  const response = await simpleFetcher({
    query: UPDATE_OFFER,
    queryVariables: {
      id: inputOffer.offer_id,
      offer: inputOffer
    }
  });

  if (response && response.status === 200 && response.data.updateOneOffer._id) {
    return true;
  }

  console.log(response);

  return false;
}

export async function hidePatronOffer(offer: PatronOffer): Promise<boolean> {

  // language=GraphQL
  const HIDE_OFFER = `
      mutation ($id: String) {
          updateOneOffer(query: {offer_id: $id}, set: {hidden: true}) {
              _id
          }
      }
  `;

  const response = await simpleFetcher({
    query: HIDE_OFFER,
    queryVariables: {
      id: offer.offer_id
    }
  });

  if (response && response.status === 200 && response.data.updateOneOffer._id) {
    return true;
  }

  console.log(response);

  return false;
}
