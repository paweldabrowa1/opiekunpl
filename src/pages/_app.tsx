import '../styles/main.css';
import { RootStoreProvider } from '../providers/RootStoreProvider';
import { NextPage } from 'next';
import AuthProvider from '../providers/AuthProvider';
import ProfileProvider from '../providers/ProfileProvider';

require('typeface-roboto');

function MyApp(
  {
    Component,
    pageProps
  }: {
    Component: NextPage;
    pageProps: any;
  }) {

  return (
    <RootStoreProvider hydrationData={pageProps.hydrationData}>
      <AuthProvider>
        <ProfileProvider>
          <Component {...pageProps} />
        </ProfileProvider>
      </AuthProvider>
    </RootStoreProvider>
  );
}

export default MyApp;


