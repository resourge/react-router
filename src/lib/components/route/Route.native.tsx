import {
	Fragment,
	type ReactNode,
	Suspense,
	forwardRef,
	useRef
} from 'react';
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
const Route = forwardRef<Screen | View, RouteProps>((props, ref) => {
	const match = useRouteMatch(props);
	const isFirstRenderRef = useRef(false);

	const defaultFallback = useDefaultFallbackContext();

	// @ts-expect-error _isInsideSwitch does exist but I want it so be exclusive to switch
	if ( !props._isInsideSwitch ) {
		if ( !match ) {
			return (<></>);
		}
	}
	// @ts-expect-error _isInsideSwitch does exist but I want it so be exclusive to switch
	else if ( props._isInsideSwitch ) {
		if ( !match && !isFirstRenderRef.current ) {
			return (<></>);
		}
		isFirstRenderRef.current = true;
	}

	// @ts-expect-error _isInsideSwitch does exist but I want it so be exclusive to switch
	const hideScreen = props._hideScreen;

	const Component = (children: ReactNode) => hideScreen ? <>{ children }</> : (
		<Screen
			{...props}
			ref={ref as any}
			style={[
				Styles.screen, 
				props.style
			]}
		>
			{ children }
		</Screen>
	);

	return Component(
		<RouteContext.Provider value={typeof match === 'string' ? undefined : (match ?? undefined)}>
			<Suspense fallback={props.fallback ?? defaultFallback}>
				{ props.children }
			</Suspense>
		</RouteContext.Provider>
	);
});

Route.displayName = 'Route';

export default Route;
