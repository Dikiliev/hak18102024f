// src/stores/rootStore.ts
import authStore from './authStore';
class RootStore {
    authStore = authStore;
}

const rootStore = new RootStore();
export default rootStore;
