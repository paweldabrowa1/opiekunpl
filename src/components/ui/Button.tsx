import { ReactNode } from 'react';

interface Props {
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  children: ReactNode
}

export const Button = (props: Props) => {
  return <button onClick={props.onClick} type={props.type}
                 className='m-4 px-4 py-3 bg-primary text-white font-bold rounded-2xl uppercase min-w-72'>
    {props.children}
  </button>
}