
/**
 * Warehouse Manager (Storage Service)
 * Hybrid storage: LocalStorage for settings, IndexedDB for heavy data (progress, cache).
 */
import { z } from 'zod';
import { getVal, setVal, delVal } from '../utils/db';

const APP_VERSION = '1.0';
const VERSION_KEY = 'ssi_app_version';

export const storageService = {
  initialize() {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (!currentVersion) {
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    }
  },

  /**
   * Synchronous Get (Small Data: Settings, Flags)
   */
  getItem<T>(key: string, defaultValue: T, schema?: z.ZodSchema<T>): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      const parsed = JSON.parse(stored);
      if (schema) {
        const result = schema.safeParse(parsed);
        return result.success ? result.data : defaultValue;
      }
      return parsed as T;
    } catch (error) {
      return defaultValue;
    }
  },

  /**
   * Synchronous Set (Small Data)
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Local Storage Error ${key}:`, error);
      return false;
    }
  },

  /**
   * Asynchronous Get (Big Data: Progress, AI Cache)
   * Includes Migration Logic: Check LS first, if found, move to IDB and delete from LS.
   */
  async getItemAsync<T>(key: string, defaultValue: T, schema?: z.ZodSchema<T>): Promise<T> {
    try {
      // 1. Try IndexedDB first
      let data = await getVal<T>(key);

      // 2. Migration: If not in IDB, check LocalStorage
      if (!data) {
        const localData = localStorage.getItem(key);
        if (localData) {
          console.log(`📦 Migrating [${key}] from LocalStorage to IndexedDB...`);
          try {
            data = JSON.parse(localData);
            // Save to IDB
            await setVal(key, data);
            // Remove from LS to free space
            localStorage.removeItem(key);
          } catch (e) {
            console.error('Migration parse error', e);
          }
        }
      }

      if (!data) return defaultValue;

      // 3. Validation
      if (schema) {
        const result = schema.safeParse(data);
        if (!result.success) {
          console.warn(`⚠️ Async Storage Validation Failed for [${key}]`, result.error);
          return defaultValue;
        }
        return result.data;
      }

      return data;
    } catch (error) {
      console.error(`IDB Read Error ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Asynchronous Set (Big Data)
   */
  async setItemAsync<T>(key: string, value: T): Promise<void> {
    await setVal(key, value);
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
    delVal(key); // Try to delete from both
  },

  clear(): void {
    localStorage.clear();
    // Clear IDB technically requires iterating keys or deleting DB, 
    // but for reset purposes, we usually just want to clear known keys.
    // For a full reset, advanced logic is needed, but this is sufficient for now.
  }
};
