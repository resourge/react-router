import { useRouter } from '../contexts'

/**
 * Hook to access action that lead to the current `URL`.
 */
export const useAction = () => {
	return useRouter().action
}
