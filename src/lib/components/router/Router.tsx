import { useMemo, type FC } from 'react';

import { useUrl } from '@resourge/react-search-params';

import { DefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { RouterContext } from '../../contexts/RouterContext';

import { type BaseRouterProps } from './RouterPropsType';

export type RouterProps = BaseRouterProps;

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const Router: FC<RouterProps> = ({ children, defaultFallback }) => {
	const [url, action, previousValue] = useUrl();

	return (
		<RouterContext.Provider 
			value={
				useMemo(
					() => ({
						url,
						action,
						previousUrl: previousValue ? previousValue[0] : undefined,
						previousAction: previousValue ? previousValue[1] : undefined
					}), 
					[url, action, previousValue]
				)
			}
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
