import { Singleton } from "../decorators";
import { IStorage, StorageType } from "./type";

@Singleton
class StorageSingleton implements IStorage {
  private storage: Storage;

  constructor(storageType: StorageType) {
    this.storage = storageType === StorageType.LocalStorage ? localStorage : sessionStorage;
  }

  find<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  add<T>(key: string, entity: T): void {
    this.storage.setItem(key, JSON.stringify(entity));
  }

  update<T>(key: string, entity: T): void {
    this.storage.setItem(key, JSON.stringify(entity));
  }

  delete(key: string): void {
    this.storage.removeItem(key);
  }
}

export const Storage = new StorageSingleton(StorageType.LocalStorage);
