import { useField } from 'formik';
import { ClassNames } from '../../../utils/UtilFunctions';
import { FormErrorBox } from './FormErrorBox';
import React, { Dispatch, useState } from 'react';

interface Props {
  value?: any,
  name: string,
  setAvatarData: Dispatch<string>;
  preview?: string;
  className?: string,
  autoFocus?: boolean,
  onChange: (event: any) => void
}

export const FormFileUpload = (props: Props) => {
  const [preview, setPreview] = useState(props.preview ?? '/assets/placeholder-human.jpg');

  const [field, meta] = useField(props.name as string);
  return <div className='grid grid-cols-1'>

    <div className='flex justify-center'>
      <div className='w-1/2 m-2'>
        <img
          className='h-full w-full rounded-full mx-auto'
          src={preview}
          alt='profile'
        />
      </div>
    </div>

    <input {...field} type='file'
           onChange={(e: any) => {
             const fileReader = new FileReader();
             fileReader.onload = () => {
               if (fileReader.readyState === 2) {
                 const result = fileReader.result as string;
                 setPreview(result);
                 props.setAvatarData(result);
               }
             };
             fileReader.readAsDataURL(e.target.files[0]);
             props.onChange(e);
           }}
    />

    {meta.touched && meta.error ? (
      <FormErrorBox>{meta.error}</FormErrorBox>
    ) : null}
  </div>;
};