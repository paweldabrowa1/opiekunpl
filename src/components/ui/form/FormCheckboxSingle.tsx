import { ReactNode } from 'react';
import { Field, useField } from 'formik';

interface Props {
  value: any,
  currentValue: any,
  name: string,
  children: ReactNode
}

export const FormCheckboxSingle = (props: Props) => {
  const [field, meta, helper] = useField(props.name as string);

  return <label className="flex items-center mx-2">
    <Field
      {...field}
      type="checkbox"
      className="form-checkbox text-primary border rounded h-6 w-6"
      name={props.name}
      value={props.value}
      onChange={() => {
        let same = props.currentValue && props.currentValue.length > 0 && props.currentValue[0] === props.value;
        helper.setValue(same ? [] : [props.value]);
      }}
    />
    <span className="ml-2 text-base">{props.children}</span>
  </label>
}