import React from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
import 'react-datepicker/dist/react-datepicker.css';
import { LocalSVG } from '../../svg/LocalSVG';
import { FormErrorBox } from './FormErrorBox';

registerLocale('pl', pl);

export const FormDatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props as any);

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 60);

  return (
    <div className={props.className || 'w-60'}>
      <div className='relative'>
        <DatePicker
          {...field}
          {...props}
          locale='pl'
          showYearDropdown={true}
          scrollableYearDropdown={true}
          yearDropdownItemNumber={100}
          dateFormat='dd MMMM yyyy'
          className='px-4 py-3 border border-primary rounded-2xl w-full text-base'
          minDate={minDate}
          maxDate={!props.noMaxDate && (props.maxDate || new Date())}
          selected={(field.value && new Date(field.value)) || null}
          onChange={val => {
            setFieldValue(field.name, val);
          }}
        />

        {props.icon && <div className='absolute top-0 w-full h-full flex justify-end items-center pr-1 pointer-events-none'>
          <LocalSVG icon={props.icon} size={8} />
        </div>}
      </div>
      {meta.touched && meta.error ? (
        <FormErrorBox>{meta.error}</FormErrorBox>
      ) : null}
    </div>
  );
};