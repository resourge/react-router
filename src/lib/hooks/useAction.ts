import { type ActionType } from '@resourge/react-search-params';

import { useRouter } from '../contexts/RouterContext';
import { type NavigationActionType } from '../utils/createHistory/HistoryType';

/**
 * Hook to access action that lead to the current `URL`.
 */
export const useAction = (): ActionType | NavigationActionType => {
	return useRouter().action;
};
