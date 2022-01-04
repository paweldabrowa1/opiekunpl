import { ReactNode } from 'react';
import { Loading } from '../Loading';

interface Props {
  children: ReactNode
}

const ProcessingPage = ({ children }: Props) => {
  return (
    <div className='flex h-screen'>
      <div className='m-auto'>
        <Loading>{children}</Loading>
      </div>
    </div>
  );
}

export default ProcessingPage;
