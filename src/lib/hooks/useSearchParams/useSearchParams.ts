import { HistoryStore } from 'node_modules/@resourge/history-store/dist/index.js';

import { makeSearchParams } from './makeSearchParams';

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useSearchParams = makeSearchParams(HistoryStore);
