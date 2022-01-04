import * as Yup from 'yup';
import { LocalIcon, LocalSVG } from '../../../svg/LocalSVG';
import { Form, Formik } from 'formik';
import { FormInput } from '../../../ui/form/FormInput';
import { FormCheckboxSingle } from '../../../ui/form/FormCheckboxSingle';
import { FormSelect } from '../../../ui/form/FormSelect';
import { PatronTime, TranslatePatronTime } from '../../../../models/Patron';
import { FormNumberInput } from '../../../ui/form/FormNumberInput';
import { Button } from '../../../ui/Button';
import React, { Dispatch } from 'react';
import { GraphQLQueryCreator } from '../../../../controls/gql/GraphQLQueryCreator';

interface ProfileListFilterBoxProps {
  profilesQueryValues: any
  profilesQueryCreator: GraphQLQueryCreator
  setProfilesQueryValues: Dispatch<any>
  setProfilesQuery: Dispatch<any>
}

export function ProfileListFilterBox(props: ProfileListFilterBoxProps) {

  const schema = Yup.object().shape({
    // firstName: Yup.string()
    //   .min(2, 'Za krotkie!')
    //   .max(50, 'Za długie!')
    //   .required('Wymagane'),
    // lastName: Yup.string()
    //   .min(2, 'Za krotkie!')
    //   .max(50, 'Za długie!')
    //   .required('Wymagane'),
    // gender: Yup.string()
    //   .required('Wymagane'),
    // birthDate: Yup.string()
    //   .required('Wymagane')
    // email: Yup.string().email('Invalid email').required('Required')
  });

  return <div className='col-span-2'>
    <div className='bg-gray-300 rounded-2xl p-4'>

      <div className='flex justify-between'>
        <div>
          <h2 className='text-xl font-bold mt-2'>
            Filtry:
          </h2>
        </div>

        <div className=''>
          <LocalSVG icon={LocalIcon.Filter} size={10} />
        </div>
      </div>

      <hr/>

      <div>
        <Formik
          initialValues={props.profilesQueryValues}
          validationSchema={schema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting }) => {
            if (values.gender.length == 0) {
              values.gender = '';
            }
            const bDMin = values.birthDateMin;
            if (bDMin) {
              const date = new Date();
              date.setFullYear(date.getFullYear() - +values.birthDateMin)
              values.birthDateMin = date.toISOString();
            }
            const bDMax = values.birthDateMax;
            if (bDMax) {
              const date = new Date();
              date.setFullYear(date.getFullYear() - +values.birthDateMax)
              values.birthDateMax = date.toISOString();
            }

            const query = props.profilesQueryCreator.query(values);

            values.birthDateMin = bDMin;
            values.birthDateMax = bDMax;

            props.setProfilesQueryValues(values);
            props.setProfilesQuery(query);
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <h3 className='font-bold mt-6'>
                Miasto
              </h3>
              <FormInput
                name='city'
                placeholder='Miasto'
                onChange={handleChange}
              />

              <div />

              <div id='gender-radio-group'>
                <h3 className='font-bold mt-2'>
                  Płeć
                </h3>
              </div>
              <div role='group' aria-labelledby='gender-radio-group' className='flex justify-start'>
                <FormCheckboxSingle value={'male'} name={'gender'}
                                    currentValue={values['gender']}>
                  Mężczyzna
                </FormCheckboxSingle>
                <FormCheckboxSingle value={'female'} name={'gender'}
                                    currentValue={values['gender']}>
                  Kobieta
                </FormCheckboxSingle>
              </div>

              <h3 className='font-bold mt-2'>
                Etat:
              </h3>
              <FormSelect name={'patronTime'} onChange={handleChange}>
                <option value='' label='Obojętnie' />
                <option value={PatronTime.FullTime} label={TranslatePatronTime(PatronTime.FullTime)} />
                <option value={PatronTime.PartTime} label={TranslatePatronTime(PatronTime.PartTime)} />
                <option value={PatronTime.FreeTime} label={TranslatePatronTime(PatronTime.FreeTime)} />
                <option value={PatronTime.OneTime} label={TranslatePatronTime(PatronTime.OneTime)} />
              </FormSelect>

              <h3 className='font-bold mt-2'>
                Stawka:
              </h3>

              <FormNumberInput
                name='patronPriceMin'
                placeholder='Min (zł)'
                onChange={handleChange}
              />
              <FormNumberInput
                name='patronPriceMax'
                placeholder='Max (zł)'
                onChange={handleChange}
              />

              <h3 className='font-bold mt-2'>
                Wiek:
              </h3>
              <FormNumberInput
                name='birthDateMin'
                placeholder='Min wiek'
                onChange={handleChange}
              />
              <FormNumberInput
                name='birthDateMax'
                placeholder='Max wiek'
                onChange={handleChange}
              />
              <div className='flex justify-center'>
                <Button type='submit'>Zatwierdź</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

    </div>
  </div>;
}