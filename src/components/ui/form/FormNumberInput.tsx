import { useField } from 'formik';
import { ClassNames } from '../../../utils/UtilFunctions';
import { LocalIcon, LocalSVG } from '../../svg/LocalSVG';
import React from 'react';
import { FormErrorBox } from './FormErrorBox';

interface Props {
  value?: any,
  placeholder: string,
  name: string,
  className?: string,
  icon?: LocalIcon,
  autoFocus?: boolean,
  onChange?: (event: any) => void
}

export const FormNumberInput = (props: Props) => {
  const [field, meta] = useField(props.name as string);
  return <div className='inline-block'>
    <div className='relative'>
      <input type='number'
             {...field} {...props}
             className={ClassNames('px-4 py-3 m-2 w-40', 'border border-primary rounded-2xl text-base', props.className)}
             placeholder={props.placeholder} autoFocus={props.autoFocus}
             onChange={props.onChange} />

      {props.icon && <div className='absolute top-0 w-full h-full flex justify-end items-center pr-1 pointer-events-none'>
        <LocalSVG icon={props.icon} size={8} />
      </div>}
    </div>
    {meta.touched && meta.error ? (
      <FormErrorBox>{meta.error}</FormErrorBox>
    ) : null}
  </div>;
};