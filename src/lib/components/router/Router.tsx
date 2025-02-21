import { type FC } from 'react';

import { DefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { RouterContext } from '../../contexts/RouterContext';
import { useUrl } from '../../hooks/useUrl/useUrl';

import { type BaseRouterProps } from './RouterPropsType';

export type RouterProps = BaseRouterProps;

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook.
 */
const Router: FC<RouterProps> = ({ children, defaultFallback }) => {
	const value = useUrl();

	return (
		<RouterContext.Provider 
			value={value}
		>
			<DefaultFallbackContext.Provider 
				value={defaultFallback}
			>
				{ children }
			</DefaultFallbackContext.Provider>
		</RouterContext.Provider>
	);
};

export default Router;
