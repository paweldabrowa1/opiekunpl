import * as Yup from 'yup';
import { LocalIcon, LocalSVG } from '../../svg/LocalSVG';
import { Form, Formik } from 'formik';
import { FormInput } from '../../ui/form/FormInput';
import { FormCheckboxSingle } from '../../ui/form/FormCheckboxSingle';
import { FormSelect } from '../../ui/form/FormSelect';
import { FormNumberInput } from '../../ui/form/FormNumberInput';
import { Button } from '../../ui/Button';
import React, { useEffect, useState } from 'react';
import { FormDatePickerField } from '../../ui/form/FormDatePickerField';
import { FormTextarea } from '../../ui/form/FormTextarea';
import {
  createPatronOffer,
  GetPatronisingRequirementFor, hidePatronOffer,
  PatronisingRequirement,
  PatronOffer,
  PatronRequirement,
  PatronRequirementDefinition, updatePatronOffer
} from '../../../models/PatronOffer';
import { useProfile } from '../../../providers/ProfileProvider';
import { PatronType } from '../../../models/Patron';
import { FormErrorBox } from '../../ui/form/FormErrorBox';
import { Loading } from '../../ui/Loading';
import { useRouter } from 'next/router';
import { generateUUID } from '../../../utils/UtilFunctions';
import { FormFileUpload } from '../../ui/form/FormFileUpload';

interface Props {
  offer: PatronOffer;
}

export function EditPatronOfferForm(props: Props) {

  function age(offer: PatronOffer) {
    const y = new Date().getFullYear() - offer.birthDate.getFullYear();
    return y < 1 ? 1 : y;
  }

  const { offer } = props;
  const animal = props.offer.type === PatronType.Animal;

  const profile = useProfile();
  const router = useRouter();

  const requirementsMap = GetPatronisingRequirementFor(animal ? PatronType.Animal : PatronType.Child);
  const requirementsMapForPatron = PatronRequirementDefinition;

  const [queryValues, setQueryValues] = useState<any>({
    // 'name': '',
    'type': offer.type,
    'age': age(offer),
    'paymentPerHour': offer.paymentPerHour || 1,
    'gender': [offer.gender],
    'patronTimeStart': offer.timeFrames.date.from,
    'patronTimeEndSet': !!offer.timeFrames.date.to ? [true] : [],
    'patronTimeEnd': offer.timeFrames.date.to || '',
    'partonTimeHoursStart': offer.timeFrames.hours.from,
    'partonTimeHoursEnd': offer.timeFrames.hours.to,
    'requirementsAdding': 'buying_food',
    'requirementsAddingForPatron': 'not_smoking',
    'title': offer.title,
    'description': offer.description,
    'avatar': '',
    'phone': offer.phoneNumber,
    'email': offer.email,
    'city': offer.localization.city,
    'street': offer.localization.street,
    'postalCode': offer.localization.postalCode,
    'hidden': [offer.hidden] || [],
    'available': [offer.available] || []
  });

  const [avatarData, setAvatarData] = useState<string>(offer.avatar);
  const [redirect, setRedirect] = useState<string>('');

  const [requirements, setRequirements] = useState<string[]>(offer.requirements.patronising);
  const [requirementsForPatron, setRequirementsForPatron] = useState<string[]>(offer.requirements.patron);

  const type = !animal ? Yup.string() : Yup.string().required('Wymagane');
  const postalCodeRegExp = new RegExp(`\\d{2}-\\d{3}`);
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const schema = Yup.object().shape({
    type,
    age: Yup.number()
      .min(1, 'Minimum wartosc to: 1')
      .max(99, 'Maksymalna wartosc to: 99')
      .required('Wymagane'),
    paymentPerHour: Yup.number()
      .min(1, 'Minimum wartosc to: 1')
      .max(15000, 'Maksymalna wartosc to: 99')
      .required('Wymagane'),
    gender: Yup.array()
      .length(1, 'Wymagane')
      .required('Wymagane'),
    patronTimeStart: Yup.string()
      .required('Wymagane'),
    patronTimeEnd: Yup.string()
      .when('patronTimeEndSet', {
        is: (patronTimeEndSet: any) => patronTimeEndSet.length > 0,
        then: Yup.string()
          .required('Wymagane')
      }),
    partonTimeHoursStart: Yup.number()
      .min(0, 'Minimum wartosc to: 0')
      .max(23, 'Maksymalna wartosc to: 23')
      .required('Wymagane'),
    partonTimeHoursEnd: Yup.number()
      .min(0, 'Minimum wartosc to: 0')
      .max(24, 'Maksymalna wartosc to: 24')
      .required('Wymagane')
      .when('partonTimeHoursStart', (partonTimeHoursStart: any, schema: any) => {
        return schema.min(partonTimeHoursStart, 'Wartosc powinna byc wyzsza lub rowna ' + partonTimeHoursStart);
      }),
    title: Yup.string()
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
    const type = animal ? PatronType.Animal : PatronType.Child;

    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - +values.age);

    const date: any = {
      from: values.patronTimeStart
    };
    if (values.patronTimeEndSet && values.patronTimeEndSet.length > 1) {
      date['to'] = values.patronTimeEnd;
    }

    const updateOffer: PatronOffer = {
      birthDate,
      description: values.description,
      paymentPerHour: values.paymentPerHour,
      email: values.email,
      gender: values.gender[0],

      localization: {
        countryCode: offer.localization.countryCode,
        postalCode: values.postalCode,
        city: values.city,
        street: values.street
      },
      name: { first: '', second: '' },
      phoneNumber: values.phone,

      profile_id: profile.profile_id,
      requirements: {
        patron: requirementsForPatron as PatronRequirement[],
        patronising: requirements as PatronisingRequirement[]
      },
      timeFrames: {
        date,
        hours: {
          from: values.partonTimeHoursStart,
          to: values.partonTimeHoursEnd
        }
      },
      type,
      title: values.title,
      offer_id: offer.offer_id,
      avatar: avatarData,
      hidden: checkFormBool(values.hidden),
      available: checkFormBool(values.available),
    };

    await updatePatronOffer(updateOffer);
    setSubmitting(false);
    setRedirect('/offer/' + updateOffer.offer_id);
  };

  const onSubmitClose = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    await hidePatronOffer(offer);
    setSubmitting(false);
    setRedirect('/offer/list');
  };

  return <div className=''>
    <Formik
      initialValues={{
        'hidden': [false]
      }}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting }) => {
        onSubmitClose(values, setSubmitting);
      }}
    >
      {({
          values,
          isSubmitting
        }) => (
        <Form>
          <div className='mt-12 mb-4'>
            <FormCheckboxSingle value={true} name={'hidden'} currentValue={values['hidden']}>
              Zamknij oferte
            </FormCheckboxSingle>
          </div>

          {checkFormBool(values.hidden) && (isSubmitting ? <Loading inline> Zamykanie oferty... </Loading> :
              <Button type='submit'>Zamknij ogloszenie</Button>
          )}
        </Form>
      )}
    </Formik>
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
          <div className='mt-12 mb-4'>
            <FormCheckboxSingle value={true} name={'available'} currentValue={values['available']}>
              Aktualność oferty
            </FormCheckboxSingle>
          </div>

          {animal && <>
            <div className='text-sm ml-4 mt-4'>
              Typ:
            </div>
            <FormSelect name={'type'} onChange={handleChange}
                        className='m-0 w-full'>
              <option value='dog' label='Pies' />
              <option value='cat' label='Kot' />
              <option value='parrot' label='Papuga' />
              <option value='rabbit' label='Królik' />
              <option value='fish' label='Ryby' />
              <option value='mouse' label='Mysz' />
              <option value='other' label='Inny' />
            </FormSelect>
          </>}

          <div className='text-sm ml-4 mt-4'>
            Wiek:
          </div>
          <FormNumberInput
            name='age'
            placeholder='Wiek w latach'
            onChange={handleChange}
            className='m-0 py-3'
          />

          <div className='text-sm ml-4 mt-4'>
            Płatność za godzine:
          </div>
          <FormNumberInput
            name='paymentPerHour'
            placeholder='Kwota (w zł)'
            onChange={handleChange}
            className='m-0 py-3'
          />

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

          <div className='mt-8'>
            <FormCheckboxSingle value={true} name={'patronTimeEndSet'} currentValue={values['patronTimeEndSet']}>
              Data końcowej opieki
            </FormCheckboxSingle>
          </div>
          <div className='grid grid-cols-2 gap-8 my-2'>
            <FormDatePickerField
              noMaxDate
              name='patronTimeStart'
              placeholderText='Data początkowa'
              className='w-full'
              icon={LocalIcon.CalendarToday}
            />
            {values.patronTimeEndSet && values.patronTimeEndSet.length > 0 && <FormDatePickerField
              noMaxDate
              name='patronTimeEnd'
              placeholderText='Data końcowa'
              className='w-full'
              icon={LocalIcon.CalendarEvent}
            />}
          </div>
          <div className='text-sm ml-4 mt-4'>
            Godziny:
          </div>
          <div className='grid grid-cols-2 gap-8 my-2'>
            <FormNumberInput
              name='partonTimeHoursStart'
              placeholder='Od'
              onChange={handleChange}
              icon={LocalIcon.Timer}
              className='m-0 py-3 sm:w-full'
            />
            <FormNumberInput
              name='partonTimeHoursEnd'
              placeholder='Od'
              onChange={handleChange}
              icon={LocalIcon.Timer}
              className='m-0 py-3 sm:w-full'
            />
          </div>

          <div className='text-sm ml-4 mt-4'>
            Zakres należności:
          </div>

          <div className='text-sm ml-8 my-4'>
            {requirements.length === 0 ?
              '- nie wybrano nic' :
              requirements.map((req: string) => (<div key={req} className='flex items-center'>
                <div className='cursor-pointer' onClick={event => {
                  const x = [...requirements];
                  x.splice(x.indexOf(req), 1);
                  setRequirements(x);
                }}>
                  <LocalSVG icon={LocalIcon.Close} size={6} fill={'red'} />
                </div>
                {getByKey(requirementsMap, req)?.label}
              </div>))}
          </div>

          <div className='flex justify-end items-center'>
            <FormSelect name={'requirementsAdding'} onChange={handleChange}
                        className='m-0 w-full'>
              {Object.entries(requirementsMap).map(([key, def]) => (
                <option key={key} value={key} label={def.label} />
              ))}
            </FormSelect>

            <div className='mx-2 cursor-pointer' onClick={event => {
              const selected = values.requirementsAdding;

              if (requirements.includes(selected)) {
                return;
              }

              const x = [selected, ...requirements];

              setRequirements(x);
            }}>
              <LocalSVG icon={LocalIcon.Add}
                        size={10}
                        fill={requirements.includes(values.requirementsAdding) ? 'gray' : undefined}
              />
            </div>
          </div>

          <div className='text-sm ml-4 mt-4'>
            Zakres wymagań od opiekuna:
          </div>

          <div className='text-sm ml-8 my-4'>
            {requirementsForPatron.length === 0 ?
              '- nie wybrano nic' :
              requirementsForPatron.map((req: string) => (<div key={req} className='flex items-center'>
                <div className='cursor-pointer' onClick={event => {
                  const x = [...requirementsForPatron];
                  x.splice(x.indexOf(req), 1);
                  setRequirementsForPatron(x);
                }}>
                  <LocalSVG icon={LocalIcon.Close} size={6} fill={'red'} />
                </div>
                {getByKey(requirementsMapForPatron, req)?.label}
              </div>))}
          </div>

          <div className='flex justify-end items-center'>
            <FormSelect name={'requirementsAddingForPatron'} onChange={handleChange}
                        className='m-0 w-full'>
              {Object.entries(requirementsMapForPatron).map(([key, def]) => (
                <option key={key} value={key} label={def.label} />
              ))}
            </FormSelect>

            <div className='mx-2 cursor-pointer' onClick={event => {
              const selected = values.requirementsAddingForPatron;

              if (requirementsForPatron.includes(selected)) {
                return;
              }

              const x = [selected, ...requirementsForPatron];

              setRequirementsForPatron(x);
            }}>
              <LocalSVG icon={LocalIcon.Add}
                        size={10}
                        fill={requirementsForPatron.includes(values.requirementsAddingForPatron) ? 'gray' : undefined}
              />
            </div>
          </div>

          <div className='text-sm ml-4 mt-4'>
            Tytuł oferty:
          </div>
          <FormInput
            name='title'
            placeholder='Tytuł'
            onChange={handleChange}
            className='m-0 w-full'
          />

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
            Obraz pociechy:
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