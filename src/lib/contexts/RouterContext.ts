import React, { useContext } from 'react';

import { type ActionType } from '@resourge/react-search-params';
import invariant from 'tiny-invariant'

export type RouterContextType = {
	action: ActionType
	url: URL

	previousAction?: ActionType
	previousUrl?: URL
}

export const RouterContext = React.createContext<RouterContextType | null>(null);

/**
 * Hook to access to current URL
 */
export const useRouter = (): RouterContextType => {
	const context = useContext(RouterContext);

	if ( __DEV__ ) {
		invariant(context, 'useRouter can only be used in the context of a <RouterContext>.')
	}

	return useContext(RouterContext) as RouterContextType
}
