import { type NavigationActionType as RNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType';
import { type NavigationActionType as RNNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType.native';

import { useRouter } from '../contexts/RouterContext';

type NavigationActionType = RNavigationActionType | RNNavigationActionType;

/**
 * Hook to access action that lead to the current `URL`.
 */
export const useAction = (): NavigationActionType => useRouter().action;
