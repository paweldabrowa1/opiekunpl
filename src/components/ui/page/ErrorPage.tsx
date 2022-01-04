import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode
}

export default function ErrorPage({ children }: Props) {
  return (
    <div className='flex h-full'>
      <div className='m-auto'>
        <i className={'fas fa-exclamation-triangle align-middle text-lg text-red-700'} />
        <div className='ml-1 inline-block text-red-500'>{children}</div>
      </div>
    </div>
  );
}
