import { ReactNode } from 'react';
import Image from 'next/image';
import { ClassNames } from '../utils/UtilFunctions';

interface Props {
  bgColor?: string;
  shadowColor?: string;
  className?: string;
  minWidth?: number;
  heightOuter?: number;
  heightInner?: number;
  children: ReactNode;
}

export const ContentPin = (
  {
    bgColor = '#FBFBFB',
    shadowColor = 'rgba(0, 0, 0, 0.07)',
    className = '',
    minWidth = 4,
    heightOuter = 10,
    heightInner = 8,
    children
  }: Props
) => {
  // return <div className={`relative h-${props.size} w-${props.size}`}>
  return <div className={ClassNames(`inline-block rounded-full h-${heightOuter} m-1 py-1`, className)} style={{
    background: bgColor,
    boxShadow: '0px 4px 0px 1px ' + shadowColor,
    minWidth: minWidth + 'rem'
  }}>
    <div className={`flex justify-center items-center h-${heightInner}`}>
      {children}
    </div>
  </div>;
};

interface InteractProps {
  className?: string;
  minWidth?: number;
  heightOuter?: number;
  heightInner?: number;
  onClick?: () => void;
  children?: ReactNode;
}

export const InteractPin = (props: InteractProps) => {
  return <ContentPin
    bgColor='#185ADB' shadowColor='rgba(24, 90, 219, 0.4)'
    className={ClassNames('hover:opacity-50 cursor-pointer', props.className || '')}
    minWidth={props.minWidth}
    heightOuter={props.heightOuter}
    heightInner={props.heightInner}
  >
    {props.children}
  </ContentPin>;
};

export const LovePin = (props: InteractProps) => {
  return <ContentPin
    bgColor='#FFE4E4' shadowColor='rgba(255, 0, 0, 0.36)'
    className='hover:opacity-50 cursor-pointer'
    minWidth={props.minWidth}
    heightOuter={props.heightOuter}
    heightInner={props.heightInner}
  >
    <div className={ClassNames('flex items-center ml-3', props.children ? 'mr-5' : 'mr-3')} style={{
      // marginTop: '-5px'
    }}>
      <div className='relative h-11 w-11 inline-block'>
        <Image
          src='/like.png'
          alt='Logo banner'
          className='drop-shadow-md'

          width={44}
          height={44}
        />
      </div>
      <span className='text-lg font-normal italic'>
        {props.children}
      </span>
    </div>
  </ContentPin>;
};