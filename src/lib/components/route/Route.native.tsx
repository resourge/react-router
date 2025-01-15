import { Suspense, forwardRef, useRef } from 'react';
import { type View } from 'react-native';

import { Screen, type ScreenProps } from 'react-native-screens';

import { useDefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { RouteContext } from '../../contexts/RouteContext';
import { Styles } from '../../utils/Styles.native';

import { useRouteMatch, type BasicRouteProps } from './RouteUtils';

export type RouteProps = BasicRouteProps & ScreenProps;

/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useMatchRoute` hook. And Route without `path` will be treated as normal components.
 */
const Route = forwardRef<View, RouteProps>((props, ref) => {
	const match = useRouteMatch(props);
	const isFirstRenderRef = useRef(false);
	const defaultFallback = useDefaultFallbackContext();

	// @ts-expect-error _isInsideSwitch does exist but I want it so be exclusive to switch
	if ( !props._isInsideSwitch && !match) {
		return (<></>);
	}
	// @ts-expect-error _isInsideSwitch does exist but I want it so be exclusive to switch
	if ( props._isInsideSwitch && !match && !isFirstRenderRef.current ) {
		return (<></>);
	}
	isFirstRenderRef.current = true;

	return (
		<Screen
			{...props}
			ref={ref}
			style={[
				Styles.screen, 
				{
					position: props.activityState === 0 ? 'absolute' : undefined
				},
				props.style
			]}
		>
			<RouteContext.Provider value={typeof match === 'string' ? undefined : (match ?? undefined)}>
				<Suspense fallback={props.fallback ?? defaultFallback}>
					{ props.children }
				</Suspense>
			</RouteContext.Provider>
		</Screen>
	);
});

Route.displayName = 'Route';

export default Route;
