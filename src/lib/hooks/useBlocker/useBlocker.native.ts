import { useBeforeURLChange } from '../useBeforeURLChange/useBeforeURLChange.native';

import { makeBlocker } from './makeBlocker';

/**
 * Fires before the route change, and serves to block or not the current route.
 * @param blocker {Blocker}
 * @returns blockerResult {BlockerResult}
 */
export const useBlocker = makeBlocker(useBeforeURLChange);
