import { useField } from 'formik';
import { ClassNames } from '../../../utils/UtilFunctions';
import TextareaAutosize from 'react-textarea-autosize';
import { FormErrorBox } from './FormErrorBox';
import React from 'react';

interface Props {
  value?: any,
  placeholder: string,
  name: string,
  className?: string,
  autoFocus?: boolean,
  onChange?: (event: any) => void
}

export const FormTextarea = (props: Props) => {
  const [field, meta] = useField(props.name as string);
  return <>
    <TextareaAutosize
      {...field} {...props}
           className={ClassNames('px-4 py-3 m-2 border border-primary rounded-2xl text-base', props.className)}
           placeholder={props.placeholder} autoFocus={props.autoFocus}
           onChange={props.onChange}/>
    {meta.touched && meta.error ? (
      <FormErrorBox>{meta.error}</FormErrorBox>
    ) : null}
  </>
}