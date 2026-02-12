
/**
 * Warehouse Manager (Storage Service)
 * Handles versioning, migrations, and runtime validation for Shelly Spanish Island
 */
import { z } from 'zod';

const APP_VERSION = '1.0';
const VERSION_KEY = 'ssi_app_version';

export const storageService = {
  /**
   * Version check and migration logic
   */
  initialize() {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (!currentVersion) {
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    } else if (currentVersion !== APP_VERSION) {
      this.migrate(currentVersion, APP_VERSION);
    }
  },

  migrate(from: string, to: string) {
    localStorage.setItem(VERSION_KEY, to);
  },

  getItem<T>(key: string, defaultValue: T, schema?: z.ZodSchema<T>): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      
      const parsed = JSON.parse(stored);
      
      if (schema) {
        const result = schema.safeParse(parsed);
        if (!result.success) {
          console.warn(`⚠️ Storage Validation Failed for [${key}]. Resetting to defaults.`, result.error);
          return defaultValue;
        }
        return result.data;
      }
      
      return parsed as T;
    } catch (error) {
      console.error(`📦 Storage Error reading ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Enhanced setItem with QuotaExceeded checks
   * Returns boolean to indicate success
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error: any) {
      // Logic for QuotaExceededError (Interactive Error Handling)
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.error("📦 Storage Full: Local storage quota exceeded.");
      } else {
        console.error(`📦 Storage Error writing ${key}:`, error);
      }
      return false;
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};
