import { type NavigationActionType as RNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType';
import { type NavigationActionType as RNNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType.native';

import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

type NavigationActionType = RNavigationActionType | RNNavigationActionType;

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
