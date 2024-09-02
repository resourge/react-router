import { type NavigationActionType } from '@resourge/history-store';

import { useBeforeURLChange } from '../useBeforeURLChange/useBeforeURLChange';

import { makeBlocker } from './makeBlocker';

/**
 * Fires before the route change, and serves to block or not the current route.
 * @param blocker {Blocker}
 * @returns blockerResult {BlockerResult}
 */
export const useBlocker = makeBlocker<NavigationActionType>(useBeforeURLChange);
