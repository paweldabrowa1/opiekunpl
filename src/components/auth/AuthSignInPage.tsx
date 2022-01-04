import React from 'react';

const LOGIN_ROUTE = '/api/auth/login';

export default function AuthSignInPage() {
  return (
    <div className='text-center mt-20 grid grid-cols-8'>
      <div className='col-start-4 col-span-2'>
        <h2 className='text-2xl font-BarlowBold text-font-heading'>Welcome</h2>
        <p className='mt-2'>To get started please login.</p>

        <a href={LOGIN_ROUTE}>
          Login
        </a>
        {/*<Button href={LOGIN_ROUTE} isExternalLink={true} text='Login' span={true} className='mt-10' />*/}
      </div>
    </div>
  );
}
