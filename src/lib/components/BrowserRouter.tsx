import { type ReactNode, type FC, type PropsWithChildren } from 'react';

import { useUrl } from '@resourge/react-search-params';

import { DefaultFallbackContext } from '../contexts/DefaultFallbackContext';
import { RouterContext } from '../contexts/RouterContext';

export type BrowserRouterProps = PropsWithChildren & {
	defaultFallback?: ReactNode
}

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const BrowserRouter: FC<BrowserRouterProps> = ({ children, defaultFallback }) => {
	const [url, action, previousValue] = useUrl();

	return (
		<RouterContext.Provider 
			value={{
				url,
				action,
				previousUrl: previousValue ? previousValue[0] : undefined,
				previousAction: previousValue ? previousValue[1] : undefined
			}}
		>
			<DefaultFallbackContext.Provider 
				value={defaultFallback}
			>
				{ children }
			</DefaultFallbackContext.Provider>
		</RouterContext.Provider>
	);
};

export default BrowserRouter;
