import { type FC, type PropsWithChildren } from 'react';

import { useUrl } from '@resourge/react-search-params';

import { RouterContext } from '../contexts/RouterContext';

export type BrowserRouterProps = PropsWithChildren

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const BrowserRouter: FC<BrowserRouterProps> = ({ children }) => {
	const [url, action] = useUrl();

	return (
		<RouterContext.Provider 
			value={{
				url,
				action
			}}
		>
			{ children }
		</RouterContext.Provider>
	);
};

export default BrowserRouter;
