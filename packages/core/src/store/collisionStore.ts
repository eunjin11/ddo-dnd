import { useSyncExternalStore } from 'react';

let ids: number[] = [];
const listeners = new Set<() => void>();

const emit = () => {
  for (const l of listeners) l();
};

export const getCollisionIds = (): number[] => ids;

export const setCollisionIds = (next: number[]) => {
  ids = next;
  emit();
};

export const subscribeCollisionIds = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useCollisionIds = () =>
  useSyncExternalStore(subscribeCollisionIds, getCollisionIds, getCollisionIds);
