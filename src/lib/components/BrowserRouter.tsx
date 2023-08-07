import { type FC, type PropsWithChildren } from 'react';

import { useUrl } from '@resourge/react-search-params';

import { RouterContext } from '../contexts/RouterContext';

export type BrowserRouterProps = PropsWithChildren<{
	base?: string
}>

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const BrowserRouter: FC<BrowserRouterProps> = ({ base = '', children }) => {
	const [url, action] = useUrl();

	return (
		<RouterContext.Provider 
			value={{
				url,
				action,
				baseUrl: base
			}}
		>
			{ children }
		</RouterContext.Provider>
	);
};

export default BrowserRouter;
