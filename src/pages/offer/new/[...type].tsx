import { Main } from '../../../templates/Main';
import { Meta } from '../../../layout/Meta';
import { LocalIcon, LocalSVG } from '../../../components/svg/LocalSVG';
import React from 'react';
import { AddNewPatronOfferForm } from '../../../components/page/offer/new/AddNewPatronOfferForm';
import { GetServerSideProps } from 'next';

const Type = ({type}: {type: string}) => {

  const isAnimal = type === 'animal';

  return (
    <Main
      meta={
        <Meta
          title='Some title'
          description='Some desc'
        />
      }
    >
      <div className='mx-10 my-4 flex justify-center'>
        <div className='md:w-2/3'>

          <div>
            <div className='flex justify-start gap-2 pb-2 items-end border-b border-thirst'>
              <LocalSVG icon={isAnimal ? LocalIcon.Animals : LocalIcon.Children} size={10}/>
              {isAnimal ? 'ZWIERZAK' : 'DZIECKO'}
            </div>

            <span className='uppercase text-sm m-0'>
              Dodaj nową ofertę opieki
            </span>
          </div>

          <div className='flex justify-center mt-4'>

            <div className='lg:w-3/5'>
              <AddNewPatronOfferForm animal={isAnimal}/>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Type;

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  ctx
) {
  const { type } = ctx.params as any;

  return {
    props: {
      type: type[0]
    }
  };
};