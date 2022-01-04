import * as Yup from 'yup';
import { LocalIcon, LocalSVG } from '../../../svg/LocalSVG';
import { Form, Formik } from 'formik';
import { FormInput } from '../../../ui/form/FormInput';
import { FormCheckboxSingle } from '../../../ui/form/FormCheckboxSingle';
import { FormSelect } from '../../../ui/form/FormSelect';
import { FormNumberInput } from '../../../ui/form/FormNumberInput';
import { Button } from '../../../ui/Button';
import React, { useEffect, useState } from 'react';
import { FormDatePickerField } from '../../../ui/form/FormDatePickerField';
import { FormTextarea } from '../../../ui/form/FormTextarea';
import {
  createPatronOffer,
  GetPatronisingRequirementFor,
  PatronisingRequirement,
  PatronOffer,
  PatronRequirement,
  PatronRequirementDefinition
} from '../../../../models/PatronOffer';
import { useProfile } from '../../../../providers/ProfileProvider';
import { PatronType } from '../../../../models/Patron';
import { FormErrorBox } from '../../../ui/form/FormErrorBox';
import { Loading } from '../../../ui/Loading';
import { useRouter } from 'next/router';
import { generateUUID } from '../../../../utils/UtilFunctions';
import { FormFileUpload } from '../../../ui/form/FormFileUpload';

interface Props {
  animal: boolean
}

export function AddNewPatronOfferForm(props: Props) {

  const { animal } = props;

  const profile = useProfile();
  const router = useRouter();

  const requirementsMap = GetPatronisingRequirementFor(props.animal ? PatronType.Animal : PatronType.Child);
  const requirementsMapForPatron = PatronRequirementDefinition;

  const [queryValues, setQueryValues] = useState<any>({
    // 'name': '',
    'type': 'dog',
    'age': '',
    'paymentPerHour': 1,
    'gender': '',
    'patronTimeStart': '',
    'patronTimeEndSet': false,
    'patronTimeEnd': '',
    'partonTimeHoursStart': '',
    'partonTimeHoursEnd': '',
    'requirementsAdding': 'buying_food',
    'requirementsAddingForPatron': 'not_smoking',
    'title': '',
    'description': '',
    'avatar': ''
  });
  const [avatarData, setAvatarData] = useState<string>('');
  const [redirect, setRedirect] = useState<string>('');

  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementsForPatron, setRequirementsForPatron] = useState<string[]>([]);

  const type = !animal ? Yup.string() : Yup.string().required('Wymagane');

  const schema = Yup.object().shape({
    type,
    avatar: Yup.string()
      .required('Wymagane'),
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
      .required('Wymagane')
    // email: Yup.string().email('Invalid email').required('Required')
  });

  useEffect(() => {
    console.log('aa2');
    if(!redirect) return;
    console.log('45d');
    setTimeout(() => {
      console.log('aaa');
      router.push(redirect);
    }, 100)
  }, [redirect])

  function getByKey(map: any, searchValue: any): any {
    for (let [key, value] of Object.entries(map)) {
      if (key === searchValue)
        return value;
    }
    return '---';
  }

  const onSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    const type = animal ? PatronType.Animal : PatronType.Child;

    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - +values.age);

    const date: any = {
      from: values.patronTimeStart,
    };
    if (values.patronTimeEndSet && values.patronTimeEndSet.length > 1) {
      date['to'] = values.patronTimeEnd;
    }

    const offer: PatronOffer = {
      birthDate,
      description: values.description,
      paymentPerHour: values.paymentPerHour,
      email: profile.email,
      gender: values.gender[0],

      localization: profile.localization,
      name: { first: '', second: '' },
      phoneNumber: profile.phoneNumber,

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
      offer_id: generateUUID(),
      avatar: avatarData,
      hidden: false,
      available: true
    };

    await createPatronOffer(offer);
    setSubmitting(false);
    setRedirect('/offer/' + offer.offer_id);
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
            Obraz pociechy:
          </div>
          <FormFileUpload name={'avatar'} onChange={handleChange}
                          setAvatarData={setAvatarData}/>


          <div className='flex justify-center mt-10'>
            {isSubmitting ? <Loading inline> Tworzenie oferty... </Loading> :
              <Button type='submit'>Wystaw oferte</Button>
            }
          </div>
        </Form>
      )}
    </Formik>
  </div>;
}