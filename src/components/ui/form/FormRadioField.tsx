import { ReactNode } from 'react';
import { Field } from 'formik';

interface Props {
  value: any,
  name: string,
  checked?: boolean,
  children: ReactNode,
}

export const FormRadioField = (props: Props) => {
  return <label className="flex items-center mx-2">
    <Field
      type="radio"
      className="form-checkbox text-primary border rounded h-6 w-6"
      name={props.name}
      value={props.value}
      checked={props.checked}
    />
    <span className="ml-2">{props.children}</span>
  </label>
}