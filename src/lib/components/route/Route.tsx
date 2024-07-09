import { Suspense } from 'react';

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

	if ( match ) {
		const Component = (
			<Suspense fallback={props.fallback ?? defaultFallback}>
				<RouteMetadata>
					{ props.children }
				</RouteMetadata>
				{ props.children }
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
