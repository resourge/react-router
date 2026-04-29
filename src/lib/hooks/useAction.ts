import { useRouter } from '../contexts/RouterContext';
import { NavigationActionType } from '../types/NavigationActionType';

/**
 * Hook to access action that lead to the current `URL`.
 */
export const useAction = (): NavigationActionType => useRouter().action;
