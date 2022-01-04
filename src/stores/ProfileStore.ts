import { Profile } from '../models/Profile';
import { RootStore } from './RootStore';
import { makeAutoObservable } from 'mobx';

export class ProfileStore {
  root: RootStore;
  profile: Profile | undefined;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
}