import { type JSX, Suspense } from 'react';

import { useDefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { RouteContext } from '../../contexts/RouteContext';
import RouteMetadata from '../routeMetadata/RouteMetadata';

import { useRouteMatch, type BasicRouteProps } from './RouteUtils';

export type RouteProps = BasicRouteProps;

/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useMatchRoute` hook. And Route without `path` will be treated as normal components.
 */
function Route(props: RouteProps): JSX.Element {
	const match = useRouteMatch(props);

	const defaultFallback = useDefaultFallbackContext();

	if ( !match ) {
		return (<></>);
	}

	const Component = (
		<Suspense fallback={props.fallback ?? defaultFallback}>
			<RouteMetadata>
				{ props.children }
			</RouteMetadata>
			{ props.children }
		</Suspense>
	);

	return match === 'NO_ROUTE' ? (
		<>
			{ Component }
		</>
	) : (
		<RouteContext.Provider value={match}>
			{ Component }
		</RouteContext.Provider>
	);
};

export default Route;
