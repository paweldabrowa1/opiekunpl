import { UserProfile } from '@auth0/nextjs-auth0';
import { reset as resetRealm } from '../../lib/RealmClient';

// const NAMESPACE = 'https://opiekun.pl/';

// interface Auth0RemappedUserMetadata {
//   // role: [string];
//   // org: string;
//   // type: [string];
//   // tenant: string;
//   // site: string;
// }

class Auth0RemappedUser {
  // public role = undefined;
  // public types = [];
  // public org = undefined;
  // public tenant = undefined;
  // public site = undefined;

  private _user: UserProfile | null = null;

  constructor(user: UserProfile | null) {
    this.user = user;
  }

  set user(user: UserProfile | null) {
    if (user) {
      this._user = user;
      // const auth0Metadata = user[NAMESPACE] as Auth0RemappedUserMetadata;
      // this.role = auth0Metadata?.role;
      // this.types = auth0Metadata?.type ?? [];
      // this.org = auth0Metadata?.org;
      // this.tenant = auth0Metadata?.tenant;
      // this.site = auth0Metadata?.site;
    } else {
      this._user = {};
      // this.role = undefined;
      // this.types = [];
      // this.org = undefined;
      // this.tenant = undefined;
      // this.site = undefined;
    }
  }

  get user(): UserProfile {
    return this._user as UserProfile;
  }

  get email(): string | null | undefined {
    return this._user?.email;
  }

  // get isSuperAdmin(): boolean {
  //   return this.role === 'superadmin';
  // }
  //
  // get isAdmin(): boolean {
  //   return this.role === 'admin' || this.isSuperAdmin;
  // }
  //
  // get isObserver(): boolean {
  //   return this.role === 'observer';
  // }
  //
  // get isRetailer(): boolean {
  //   return this.types.some((t) => t === 'retailer');
  // }
  //
  // get isBrand(): boolean {
  //   return this.types.some((t) => t === 'brand');
  // }
  //
  // get isSupport(): boolean {
  //   return this.types.some((t) => t === 'support');
  // }
  //
  // get isTenant(): boolean {
  //   return this.types.some((t) => t === 'tenant');
  // }
  //
  // get isManufacturer(): boolean {
  //   return this.types.some((t) => t === 'manufacturer');
  // }
  //
  // get isSiteAccount(): boolean {
  //   return !!this.site;
  // }
  //
  // get userOrg(): string {
  //   return this.org;
  // }
  //
  // get hasTenant(): boolean {
  //   return !!this.tenant;
  // }
  //
  // hasTypes(types: string[]): boolean {
  //   return this.types.some((t) => types.includes(t));
  // }
  //
  // hasRole(role: string): boolean {
  //   return this.role === role;
  // }

  logout() {
    console.log('Logging out...');
    // cleanup the session
    resetRealm();
    // not using Next Router as this will result in external redirect
    window.location.replace('/api/auth/logout');
  }
}

export { Auth0RemappedUser };