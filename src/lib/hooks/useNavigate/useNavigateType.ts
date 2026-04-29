import { NavigationActionType } from 'src/lib/types/NavigationActionType';

import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

export type BaseNavigateOptions = {
	/**
	 * A way to specify the action
	 */
	action?: Exclude<NavigationActionType, 'initial'>
	/**
	 * Prevents scroll reset
	 * @default false
     * @platform web
	 */
	preventScrollReset?: boolean
	/**
	 * Replaces path instead of push
	 * @default false
	 */
	replace?: boolean
};

export type NavigateMethod<NO> = (to: NavigateTo, options?: NO) => void;
