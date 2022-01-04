import { ReactNode } from 'react';
import { useField } from 'formik';
import { ClassNames } from '../../../utils/UtilFunctions';

interface Props {
  name: string,
  className?: string
  children: ReactNode,
  onChange?: (event: any) => void
}

export const FormSelect = (props: Props) => {
  const [field, meta, helper] = useField(props.name as string);

  return <select className={ClassNames('p-4 m-2 border border-primary rounded-2xl text-base', props.className)}
      {...field}
      onChange={props.onChange}
    >
      {props.children}
    </select>
}