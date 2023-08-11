import { useRef } from 'react'

import { useRouter } from '../contexts';

/**
 * Hook to return the previous URL.
 * * Note: This hook will always return the first previous URL (In first render, saves previousUrl).
 * @returns URL
 */
export const usePreviousUrl = () => {
	const { previousUrl } = useRouter();

	const previousUrlRef = useRef(previousUrl);

	return previousUrlRef.current
}
