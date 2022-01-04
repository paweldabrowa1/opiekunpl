import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { FormInput } from '../../ui/form/FormInput';
import { FormCheckboxSingle } from '../../ui/form/FormCheckboxSingle';
import { FormSelect } from '../../ui/form/FormSelect';
import { FormNumberInput } from '../../ui/form/FormNumberInput';
import { Button } from '../../ui/Button';
import React, { useEffect, useState } from 'react';
import { FormTextarea } from '../../ui/form/FormTextarea';
import { PatronPaymentType, PatronType } from '../../../models/Patron';
import { FormErrorBox } from '../../ui/form/FormErrorBox';
import { Loading } from '../../ui/Loading';
import { useRouter } from 'next/router';
import { FormFileUpload } from '../../ui/form/FormFileUpload';
import { Profile, ProfileType, updateProfile } from '../../../models/Profile';

interface Props {
  profile: Profile;
}

export function EditProfileForm(props: Props) {

  // function age(offer: PatronOffer) {
  //   const y = new Date().getFullYear() - offer.birthDate.getFullYear();
  //   return y < 1 ? 1 : y;
  // }

  const { profile } = props;

  const router = useRouter();

  const [queryValues, setQueryValues] = useState<any>({
    // 'name': '',
    'type': profile.type,
    'paymentPerHour': profile.patron.payment.amount || 0,
    'gender': [profile.gender],
    'patronType': profile.patron.type === PatronType.NotSet ? PatronType.Any : profile.patron.type,
    'description': profile.description,
    'firstName': profile.name.first,
    'lastName': profile.name.second,
    'avatar': '',
    'phone': profile.phoneNumber,
    'email': profile.email,
    'city': profile.localization.city,
    'street': profile.localization.street,
    'postalCode': profile.localization.postalCode,
    'available': [profile.available] || []
  });

  const [avatarData, setAvatarData] = useState<string>(profile.avatar);
  const [redirect, setRedirect] = useState<string>('');

  const postalCodeRegExp = new RegExp(`\\d{2}-\\d{3}`);
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const schema = Yup.object().shape({
    paymentPerHour: Yup.number()
      .min(0, 'Minimum wartosc to: 1')
      .max(15000, 'Maksymalna wartosc to: 99')
      .required('Wymagane'),
    gender: Yup.array()
      .length(1, 'Wymagane')
      .required('Wymagane'),
    patronType: Yup.string()
      .required('Wymagane'),
    firstName: Yup.string()
      .required('Wymagane'),
    lastName: Yup.string()
      .required('Wymagane'),
    description: Yup.string()
      .required('Wymagane'),
    postalCode: Yup.string()
      .matches(postalCodeRegExp, 'Wzór kodu pocztowego: XX-XXX')
      .required('Wymagane'),
    city: Yup.string()
      .required('Wymagane'),
    street: Yup.string()
      .required('Wymagane'),
    email: Yup.string()
      .required('Wymagane'),
    phone: Yup.string()
      .matches(phoneRegExp, 'Podaj poprawny numer telefonu')
      .required('Wymagane')
    // email: Yup.string().email('Invalid email').required('Required')
  });

  useEffect(() => {
    if (!redirect) return;

    setTimeout(() => {
      router.push(redirect);
    }, 100);
  }, [redirect]);

  function getByKey(map: any, searchValue: any): any {
    for (let [key, value] of Object.entries(map)) {
      if (key === searchValue)
        return value;
    }
    return '---';
  }

  function checkFormBool(b: any) {
    if (!b) return false;
    if (b.length === 0) return false;
    if (!b[0]) return false;
    return true;
  }

  const onSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);

    const updProfile: Profile = {
      localization: {
        countryCode: profile.localization.countryCode,
        postalCode: values.postalCode,
        city: values.city,
        street: values.street
      },
      name: {
        first: values.firstName,
        second: values.lastName,
      },
      type: values.type,
      email: values.email,
      phoneNumber: values.phone,
      profile_id: profile.profile_id,
      description: values.description,
      gender: values.gender[0],
      avatar: avatarData,
      birthDate: profile.birthDate,
      registerDate: profile.registerDate,
      auth_id: profile.auth_id,
      available: checkFormBool(values.available),
      patron: {
        time: profile.patron.time,
        type: values.patronType,
        payment: {
          amount: values.paymentPerHour,
          type: PatronPaymentType.PerHour
        }
      }
    };

    await updateProfile(updProfile);
    setSubmitting(false);
    setRedirect('/profile/' + updProfile.profile_id);
  };


  return <div className=''>
    <Formik
      initialValues={queryValues}
      validationSchema={schema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting }) => {
        onSubmit(values, setSubmitting);
      }}
    >
      {({
          values,
          handleChange,
          touched,
          errors,
          isSubmitting
        }) => (
        <Form>
          <>
            <div className='text-sm ml-4 mt-12'>
              Typ:
            </div>
            <FormSelect name={'type'} onChange={handleChange}
                        className='m-0 w-full'>
              <option value={ProfileType.Nanny} label='Niania' />
              <option value={ProfileType.Member} label='Zwykły użytkownik' />
            </FormSelect>
          </>

          {values.type === ProfileType.Nanny && <>
            <div className='mt-12 mb-4'>
              <FormCheckboxSingle value={true} name={'available'} currentValue={values['available']}>
                Możliwy do zatrudnienia
              </FormCheckboxSingle>
            </div>

            <div className='text-sm ml-4 mt-4'>
              Płatność za godzine:
            </div>
            <FormNumberInput
              name='paymentPerHour'
              placeholder='Kwota (w zł)'
              onChange={handleChange}
              className='m-0 py-3'
            />

            <div className='text-sm ml-4 mt-4'>
              Preferowana opieka:
            </div>
            <FormSelect name={'patronType'} onChange={handleChange}
                        className='m-0 w-full'>
              <option value={PatronType.Any} label='Obojetnie' />
              <option value={PatronType.Animal} label='Zwierzeta' />
              <option value={PatronType.Child} label='Dzieci' />
            </FormSelect>
          </>}

          <div className='text-sm ml-4 mt-4 mb-2'>
            Płeć:
          </div>
          <div role='group' aria-labelledby='gender-radio-group' className='flex justify-start'>
            <FormCheckboxSingle value={'male'} name={'gender'}
                                currentValue={values['gender']}>
              On
            </FormCheckboxSingle>
            <FormCheckboxSingle value={'female'} name={'gender'}
                                currentValue={values['gender']}>
              Ona
            </FormCheckboxSingle>
          </div>
          {touched.gender && errors.gender ? (
            <FormErrorBox>{errors.gender}</FormErrorBox>
          ) : null}

          <div className='text-sm ml-4 mt-4'>
            Opis oferty:
          </div>
          <FormTextarea
            name='description'
            placeholder='Opis'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Imię
          </div>
          <FormInput
            name='firstName'
            placeholder='Imię'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Nazwisko
          </div>
          <FormInput
            name='lastName'
            placeholder='Nazwisko'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Email
          </div>
          <FormInput
            name='email'
            placeholder='Adres email'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Telefon:
          </div>
          <FormInput
            name='phone'
            placeholder='Numer telefonu'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Kod pocztowy:
          </div>
          <FormInput
            name='postalCode'
            placeholder='Kod pocztowy'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Miasto:
          </div>
          <FormInput
            name='city'
            placeholder='Miasto'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Ulica:
          </div>
          <FormInput
            name='street'
            placeholder='Ulica i numer domu'
            onChange={handleChange}
            className='m-0 w-full'
          />

          <div className='text-sm ml-4 mt-4'>
            Awatar:
          </div>
          <FormFileUpload name={'avatar'} onChange={handleChange}
                          preview={avatarData}
                          setAvatarData={setAvatarData} />

          <div className='flex justify-center mt-10'>
            {isSubmitting ? <Loading inline> Aktualizowanie oferty... </Loading> :
              <Button type='submit'>
                {checkFormBool(values.hidden) ? 'Zamknij ogloszenie' : 'Aktualizuj'}
              </Button>
            }
          </div>
        </Form>
      )}
    </Formik>
  </div>;
}