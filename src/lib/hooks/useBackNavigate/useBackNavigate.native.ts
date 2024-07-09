import { History } from 'src/lib/utils/createHistory/createHistory.native';

import { type BackNavigateMethod } from './useBackNavigateType';

/**
 * Returns a method for go back.
 */
export const useBackNavigate = (): BackNavigateMethod => {
	return (delta?: number) => {
		History.goBack(delta);
	};
};
