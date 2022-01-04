import { ReactNode } from 'react';
import Loader from 'react-loader-spinner';

interface Props {
  classNameText?: string,
  inline?: boolean,
  children: ReactNode
}

export const Loading = ({ classNameText = '', inline = false, children = undefined }: Props) => {

  if (!classNameText) {
    if (!inline) classNameText = 'mt-5';
    else classNameText = 'text-sm text-gray-900 ml-1 my-auto';
  }

  function LoaderSpin({ ...props }) {
    return <Loader type="Puff" color='#0A1931' height={30} width={30} {...props} />;
  }

  if (inline) {
    return (
      <div className="flex text-center justify-center" suppressHydrationWarning={true}>
        <div className="inline-block">
          <LoaderSpin />
        </div>

        {children && <div className={classNameText}>{children}</div>}
      </div>
    );
  }
  return (
    <div className="text-center" suppressHydrationWarning={true}>
      <LoaderSpin className="inline-block" suppressHydrationWarning={true} />
      {children && <div className={classNameText + ' text-gray-900 '}>{children}</div>}
    </div>
  );
}
