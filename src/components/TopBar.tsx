import Image from 'next/image';
import { AppConfig } from '../utils/AppConfig';
import { LocalIcon, LocalSVG } from './svg/LocalSVG';
import { useState } from 'react';
import Link from 'next/link';
import { useProfile } from '../providers/ProfileProvider';

interface Props {
  links: TopBarLink[]
}

interface TopBarLink {
  name: string;
  href: string;
  raw?: boolean;
}

const TopBarLink = (props: TopBarLink) => {
  return <div className='h-8 bg-white flex items-center'>
    {props.raw ?
      <a className='text-gray-700 border-none hover:text-gray-900 w-full' href={props.href}>
        <div className='mx-10'>
          {props.name}
        </div>
      </a>
      :
      <Link href={props.href}>
        <a className='text-gray-700 border-none hover:text-gray-900 w-full'>
          <div className='mx-10'>
            {props.name}
          </div>
        </a>
      </Link>
    }
  </div>;
};

interface MenuProps {
  links: TopBarLink[]
}

const TopBarMenu = (props: MenuProps) => {
  return <div
    className='absolute bg-white h-screen w-120 right-0 bg-primary z-10'
    style={{ width: '20rem' }}
  >
    <div className='h-16 bg-white mb-4'>

    </div>
    {props.links.map(link => <TopBarLink key={link.name} {...link} />)}
  </div>;
};

export const TopBar = (props: Props) => {
  const profile = useProfile();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return <div className='flex-1 flex flex-col'>
    <nav className='px-1 flex justify-between bg-white h-16 border-b border-thirst mb-6 select-none'>

      <Link href='/'>
        <ul className='flex items-center cursor-pointer'>
          <li className='relative h-14 w-14'>
            <Image
              src='/logo.png'
              alt='Logo banner'

              layout='fill'
            />
            {/*<img*/}
            {/*  className="h-full w-full mx-auto"*/}
            {/*  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/512px-Svelte_Logo.svg.png"*/}
            {/*  alt="svelte logo" />*/}
          </li>
          <li>
            <h1 className='lg:pl-0 text-gray-700 uppercase font-bold'>{AppConfig.title}</h1>
          </li>
        </ul>
      </Link>

      {/*<ul className="flex items-center">*/}
      {/*  <li>*/}
      {/*    <h1 className="pl-8 lg:pl-0 text-gray-700">{AppConfig.title}</h1>*/}
      {/*  </li>*/}
      {/*</ul>*/}

      <ul className='flex items-center cursor-pointer'>
        <Link href={'/profile/' + profile.profile_id}>
          <li className="h-10 w-10">
            <img
              className="h-full w-full rounded-full border-thirst border shadow mx-auto"
              src={profile.avatar}
              alt="profile" />
          </li>
        </Link>

        <li className='px-6 z-20' onClick={() => setMenuOpen(!menuOpen)}>
          <LocalSVG icon={LocalIcon.Menu} size={10} />
        </li>
      </ul>

    </nav>
    {menuOpen && <TopBarMenu links={props.links} />}
  </div>;
};