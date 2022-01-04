import { Meta } from '../layout/Meta';
import { GetServerSideProps } from 'next';
import { Main } from '../templates/Main';
import Link from 'next/link';
import { ClassNames } from '../utils/UtilFunctions';
import React, { ReactNode } from 'react';
import Image from 'next/image';
//
// const GET_USER_READ_NOTIFICATION_DATE = `
//     query {
//         task {
//             name
//             task_id
//         }
//     }
// `;

interface BasicOptionProps {
  href: string;
  img: string;
  children?: ReactNode
}

const BasicOption = (props: BasicOptionProps) => {

  return <Link href={props.href}>
    <div className='flex justify-center'>
      <div className={ClassNames(
        'w-full cursor-pointer',
        'hover:border-secondary hover:text-secondary'
      )}>
        <div className=''>
          <img
            className='h-40 w-40 md:h-80 md:w-80 mx-auto rounded-tr-2xl rounded-tl-2xl'
            src={'/assets/mainimg/' + props.img}
            alt='profile'
          />
        </div>
        <div className='flex justify-center'>
          <div className='py-2 w-40 md:w-80 bg-thirst text-center rounded-br-2xl rounded-bl-2xl font-bold text-sm'>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  </Link>;
};

const Index = () => {

  // useEffectForGQLQuery(
  //   {
  //     query: GET_USER_READ_NOTIFICATION_DATE,
  //     handle: (responseData) => {
  //       console.log("XAXA", responseData.data);
  //     },
  //   },
  //   []
  // );
  // const user = useUser();
  // console.log(user);
  // const profile = useProfile();
  // console.log(profile);


  return (
    <Main
      meta={
        <Meta
          title='Some title'
          description='Some desc'
        />
      }
    >
      <div className='mx-20 my-4 grid grid-cols-1 md:grid-cols-2 gap-4'>

        <BasicOption href={'/profile/list'}
                     img='search.jpeg'>
          Znajdz opiekuna
        </BasicOption>
        <BasicOption href={'/offer/list'}
                     img='careoffers.jpg'>
          Przegladaj oferty opieki
        </BasicOption>
        <BasicOption href={'/offer/new/animal'}
                     img='newanimal.jpg'>
          Dodaj oferte opieki zwierzecia
        </BasicOption>
        <BasicOption href={'/offer/new/children'}
                     img='newchild.jpg'>
          Dodaj oferte opieki pociechy
        </BasicOption>
      </div>
    </Main>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  ctx
) {
  let start = 0;

  if (ctx.query.start && typeof ctx.query.start === 'string') {
    start = Number(ctx.query.start);
  }

  return {
    props: {
      hydrationData: {
        stopwatchStore: {
          start
        }
      }
    }
  };
};