import { History } from '@resourge/history-store/mobile';

import { type BackNavigateMethod } from './useBackNavigateType';

/**
 * Returns a method for go back.
 */
export const useBackNavigate = (): BackNavigateMethod => {
	return (delta?: number) => {
		History.goBack(delta);
	};
};
