import { HistoryStore } from '@resourge/history-store/mobile';

import { makeSearchParams } from './makeSearchParams';

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useSearchParams = makeSearchParams(HistoryStore);
