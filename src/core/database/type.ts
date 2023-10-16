export interface IStorage {
  find<T>(key: string): T | null;
  add<T>(key: string, entity: T): void;
  update<T>(key: string, entity: T): void;
  delete(key: string): void;
}

export enum StorageType {
  LocalStorage = 'localStorage',
  SessionStorage = 'sessionStorage',
}
