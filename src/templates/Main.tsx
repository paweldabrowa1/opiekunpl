import { ReactNode } from 'react';

import { TopBar } from '../components/TopBar';

type Props = {
  meta: ReactNode;
  children: ReactNode;
};

export const Main = (props: Props) => (
  <div className='antialiased w-full text-gray-700'>
    {props.meta}

    <TopBar links={[
      // {
      //   name: 'About',
      //   href: '/about'
      // },
      {
        name: 'Znajdz opiekuna',
        href: '/profile/list'
      },
      {
        name: 'Przegladaj oferty opieki',
        href: '/offer/list'
      },
      {
        name: 'Dodaj oferte opieki zwierzecia',
        href: '/offer/new/animal'
      },
      {
        name: 'Dodaj oferte opieki pociechy',
        href: '/offer/new/child'
      },
      {
        name: 'Wyloguj sie',
        href: '/api/auth/logout',
        raw: true
      },
    ]} />

    <div className='text-xl content'>{props.children}</div>
  </div>
);
