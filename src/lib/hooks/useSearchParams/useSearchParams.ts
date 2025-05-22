import { HistoryStore } from '@resourge/history-store';

import { useBaseSearchParams } from './useBaseSearchParams';

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useSearchParams = <T extends Record<string, any>>(defaultParams?: T) => {
	return useBaseSearchParams(
		HistoryStore,
		defaultParams
	);
};
