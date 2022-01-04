import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode
}

export const FormErrorBox = (props: Props) => {
  return <div className='error inline-block text-red-500 text-xs'>* {props.children}</div>;
}