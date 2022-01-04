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
  offersQueryValues: any
  offersQueryCreator: GraphQLQueryCreator
  setOffersQueryValues: Dispatch<any>
  setOffersQuery: Dispatch<any>
}

export function OfferListFilterBox(props: ProfileListFilterBoxProps) {

  const schema = Yup.object().shape({
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
          initialValues={props.offersQueryValues}
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

            const query = props.offersQueryCreator.query(values);

            values.birthDateMin = bDMin;
            values.birthDateMax = bDMax;

            props.setOffersQueryValues(values);
            props.setOffersQuery(query);
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
                  On
                </FormCheckboxSingle>
                <FormCheckboxSingle value={'female'} name={'gender'}
                                    currentValue={values['gender']}>
                  Ona
                </FormCheckboxSingle>
              </div>

              <div id='type-radio-group'>
                <h3 className='font-bold mt-2'>
                  Rodzaj
                </h3>
              </div>
              <div role='group' aria-labelledby='type-radio-group' className='flex justify-start'>
                <FormCheckboxSingle value={'child'} name={'type'}
                                    currentValue={values['type']}>
                  Dziecko
                </FormCheckboxSingle>
                <FormCheckboxSingle value={'animal'} name={'type'}
                                    currentValue={values['type']}>
                  Zwierze
                </FormCheckboxSingle>
              </div>

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