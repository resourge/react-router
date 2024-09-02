import { type NavigationActionType } from '@resourge/history-store/mobile';

import { type Blocker } from '../index.native';
import { useBlocker } from '../useBlocker/useBlocker.native';
import { type BlockerResult } from '../useBlocker/useBlockerTypes';

export type UsePromptProps = {
	/**
	 * When true blocks url change
	 */
	when: boolean | Blocker<NavigationActionType>
};

/**
 * @param when When `true` it will prompt the user 
 * 	before navigating away from a screen. 
 *  (accepts method that return's boolean).
 */
export const usePrompt = ({ when }: UsePromptProps): BlockerResult => {
	return useBlocker(typeof when === 'boolean' ? () => when : (when));
};
