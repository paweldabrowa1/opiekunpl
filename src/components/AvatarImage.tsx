import Image from 'next/image';

interface Props {
  raw: boolean;
  url: string;
  size?: number;
}

export const AvatarImage = (props: Props) => {
  // return <div className={`relative h-${props.size} w-${props.size}`}>

  const size = props.size || 60;

  return <div className={`bg-thirst w-${size} h-${size} rounded-full`} style={{
    boxShadow: '0px 8px 0px rgba(255, 201, 71, 0.33)'
  }}>
    <div className='px-2 pt-3 pb-1'>
      {props.raw ?
        <img
          className="h-full w-full rounded-full mx-auto"
          src={props.url}
          alt="profile"
        />
        :
        <Image
          src={props.url}
          alt='profile'

          layout='fill'
        />
      }
    </div>
  </div>
}