import { type ActionType } from '@resourge/react-search-params'

import { useRouter } from '../contexts'

/**
 * Hook to access action that lead to the current `URL`.
 */
export const useAction = (): ActionType => {
	return useRouter().action
}
