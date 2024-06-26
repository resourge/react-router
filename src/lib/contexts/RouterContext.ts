import { createContext, useContext } from 'react';

import { type ActionType } from '@resourge/react-search-params';
import invariant from 'tiny-invariant';

export type RouterContextType = {
	action: ActionType
	url: URL

	previousAction?: ActionType
	previousUrl?: URL
};

export const RouterContext = createContext<RouterContextType | null>(null);

/**
 * Hook to access to current URL
 */
export const useRouter = (): RouterContextType => {
	const context = useContext(RouterContext);

	if ( __DEV__ ) {
		invariant(context, 'useRouter can only be used in the context of a <RouterContext>.');
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return context!;
};
