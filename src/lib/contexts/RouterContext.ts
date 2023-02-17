// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { createContext, useContext } from 'react';

import { type ActionType } from '@resourge/react-search-params';
import invariant from 'tiny-invariant'

export type RouterContextType = {
	action: ActionType
	url: URL
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const RouterContext = createContext<RouterContextType>(null!);

/**
 * Hook to access to current URL
 */
export const useRouter = () => {
	const context = useContext(RouterContext);

	if ( __DEV__ ) {
		invariant(context, 'useUrl can only be used in the context of a <RouterContext>.')
	}

	return useContext(RouterContext)
}
