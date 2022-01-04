import { CounterHydration, CounterStore } from './CounterStore';
import { sizeSwitcherStoreFactory } from './SizeSwitcherStore';
import { ProfileStore } from './ProfileStore';

export type RootStoreHydration = {
  stopwatchStore?: CounterHydration;
};
export class RootStore {
  profileStore: ProfileStore;
  counterStore: CounterStore;
  sizeSwitcherStore: ReturnType<typeof sizeSwitcherStoreFactory>;

  constructor() {
    this.profileStore = new ProfileStore(this);
    this.counterStore = new CounterStore(this);
    this.sizeSwitcherStore = sizeSwitcherStoreFactory(this);
  }

  hydrate(data: RootStoreHydration) {
    if (data.stopwatchStore) {
      this.counterStore.hydrate(data.stopwatchStore);
    }
  }
}
