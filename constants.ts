
export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];

/**
 * Returns the current date in YYYY-MM-DD format.
 * Must be a function to ensure it reflects the actual time when called,
 * preventing stale date bugs in long-running sessions.
 */
export const getTodayDateString = () => new Date().toISOString().split('T')[0];

// Aggregated Data Exports
export { VOCABULARY_DATA } from './data/courseData';
export { EXTRA_CANDIDATES } from './data/expansionData';
export { ISLAND_SLANG } from './data/slangData';
