import { Profile, ProfileType } from '../models/Profile';
import { generateUUID } from '../utils/UtilFunctions';
import { Gender } from '../models/LivingEntity';
import { PatronPaymentType, PatronTime, PatronType } from '../models/Patron';

const MockProfile: Profile = {
  profile_id: generateUUID(),
  auth_id: generateUUID(),
  birthDate: new Date(),
  description: 'Lorem dolores',
  email: 'some@gmail.com',
  gender: Gender.Female,
  name: {
    first: 'Some first name',
    second: 'Secondary'
  },
  phoneNumber: '123321123',
  type: ProfileType.Nanny,
  registerDate: new Date(),
  patron: {
    payment: {
      amount: 123,
      type: PatronPaymentType.PerPatronSession
    },
    time: PatronTime.FreeTime,
    type: PatronType.Any
  },
  localization: {
    countryCode: "PL",
    city: 'Kraków',
    street: 'Jana Zamoyskiego 80',
    postalCode: "some_code"
  }
};
export { MockProfile };