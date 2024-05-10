import { Suspense, type ReactNode } from 'react';

import { useDefaultFallbackContext } from '../contexts/DefaultFallbackContext';
import { RouteContext } from '../contexts/RouteContext';
import { useMatchPath } from '../hooks';
import { type MatchPathProps } from '../hooks/useMatchPath';
import { type MatchResult } from '../utils/matchPath';
import { validateRouteProps } from '../utils/validateRouteProps';

import RouteMetadata from './RouteMetadata';

export type BaseRouteProps = Omit<MatchPathProps, 'path'> & {
	path?: MatchPathProps['path']
};

export type RouteProps = BaseRouteProps & { 
	children?: ReactNode
	fallback?: ReactNode
};

export type IRouteProps = RouteProps & {
	computedMatch?: MatchResult | null
};

/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useMatchRoute` hook. And Route without `path` will be treated as normal components.
 */
function Route(props: RouteProps): JSX.Element {
	const {
		children,
		computedMatch,
		fallback,
		...matchProps
	} = props as IRouteProps;
	if ( __DEV__ ) {
		validateRouteProps(matchProps);
	}

	const defaultFallback = useDefaultFallbackContext();

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const match = matchProps.path === undefined ? 'NO_ROUTE' : useMatchPath(matchProps as MatchPathProps, computedMatch);

	if ( match ) {
		const Component = (
			<Suspense fallback={fallback ?? defaultFallback}>
				<RouteMetadata>
					{ children }
				</RouteMetadata>
				{ children }
			</Suspense>
		);
		
		if ( match === 'NO_ROUTE' ) {
			return (
				<>
					{ Component }
				</>
			);
		}

		return (
			<RouteContext.Provider value={match}>
				{ Component }
			</RouteContext.Provider>
		);
	}

	return (<></>);
};

export default Route;
