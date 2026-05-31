import { useEffect, useState } from "react";

type PersistedStore = {
  persist: {
    hasHydrated: () => boolean;
    rehydrate: () => Promise<void> | void;
    onHydrate: (callback: () => void) => () => void;
    onFinishHydration: (callback: () => void) => () => void;
  };
};

export function usePersistHydration(store: PersistedStore) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(store.persist.hasHydrated());
    const unsubscribeHydrate = store.persist.onHydrate(() => setHydrated(false));
    const unsubscribeFinish = store.persist.onFinishHydration(() => setHydrated(true));
    void store.persist.rehydrate();

    return () => {
      unsubscribeHydrate();
      unsubscribeFinish();
    };
  }, [store]);

  return hydrated;
}