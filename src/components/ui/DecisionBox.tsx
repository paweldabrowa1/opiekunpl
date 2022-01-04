import { ReactNode } from 'react';

interface Props {
  children: ReactNode,
  onClick?: any
}

export const DecisionBox = (props: Props) => {

  return <div className={'px-4 py-3 w-60 border border-primary rounded-2xl cursor-pointer uppercase '
  + 'hover:border-secondary hover:text-secondary'} onClick={props.onClick}>
    {props.children}
  </div>
}