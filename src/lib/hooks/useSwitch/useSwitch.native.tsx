import {
	Children,
	cloneElement,
	useEffect,
	useMemo,
	useRef,
	type LegacyRef,
	type ReactElement
} from 'react';
import {
	Animated,
	Easing,
	type ScaledSize,
	type StyleProp,
	StyleSheet,
	type ViewStyle,
	useWindowDimensions
} from 'react-native';

import { ScreenContainer } from 'react-native-screens';

import { type BaseRouteProps } from 'src/lib/components/route/RouteUtils';
import { IsFocusedContext } from 'src/lib/contexts/IsFocusedContext';
import { useTabConfig, type TabProps } from 'src/lib/contexts/TabConfigContext';
import { Styles } from 'src/lib/utils/Styles.native';
import { type MatchResult } from 'src/lib/utils/matchPath';

import { type RedirectProps } from '../../components/redirect/Redirect.native';
import Route, { type RouteProps } from '../../components/route/Route.native';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';

import { type SwitchRouteProps, getMatchFromProps, isNavigateOrRedirect } from './useSwitchUtils';

export type UseSwitchProps = {
	children: Array<ReactElement<SwitchRouteProps>> | ReactElement<SwitchRouteProps>
	/**
	 * Show animation when switching Screens
	 * @default true
	 * @platform mobile
	 */
	animated?: boolean
	/**
	 * Animation when switching screens
	 * @default (animation, { width }) => ({
			transform: [
				{
					translateX: animation.interpolate({
						inputRange: [-1, 0, 1],
						outputRange: [-width, 0, width]
					})
				}
			]
		})
	 * @platform mobile
	 */
	animation?: (animation: Animated.Value, windowDimensions: ScaledSize) => StyleProp<ViewStyle>
	/**
	 * Animation duration
	 * @default 500
	 * @platform mobile
	 */
	duration?: number
};

/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
export const useSwitch = (
	{ 
		children, 
		duration = 500,
		animated = true,
		/* animation = (animation, { width }) => ({
		opacity: animation.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: [0, 1, 0]
		})
	}) */
		animation = (animation, { width }) => ({
			transform: [
				{
					translateX: animation.interpolate({
						inputRange: [-1, 0, 1],
						outputRange: [-width, 0, width]
					})
				}
			]
		})
	}: UseSwitchProps
) => {	
	const childs = Children.toArray(children) as Array<ReactElement<RouteProps & TabProps> & { ref?: LegacyRef<any> }>;

	const { url, action } = useRouter();
	const baseContext = useLanguageContext();
	const childKeysRef = useRef<string[]>([]);
	const windowDimensions = useWindowDimensions();
	const { historyMode } = useTabConfig();
	const matchRef = useRef<{ 
		index: number
		match: MatchResult<Record<string, string>> | null 
	} | null>(null);

	const getMatchRef = (props: RouteProps & TabProps, index: number) => {
		const match = !( !isNavigateOrRedirect(props as RedirectProps) && (props as BaseRouteProps).path === undefined ) ? getMatchFromProps(url, props, baseContext) : null;

		if ( match ) {
			matchRef.current = {
				match,
				index
			};
		}

		return match;
	};

	const animationRef = useMemo(() => childs.map(({ props }, index) => {
		const match = getMatchRef(props, index);

		return {
			activityState: new Animated.Value(match ? 0 : 1),
			animation: new Animated.Value(match ? 0 : 1)
		};
	}), [childs.length]);

	const nextIndex = childs.findIndex(({ props }, index) => getMatchRef(props, index));

	useEffect(() => {
		matchRef.current = null;
		if ( animated ) {
			Animated.parallel(
				animationRef.map(({ activityState, animation }, index) => {
					const toValue = index === nextIndex
						? 0 
						: 1;

					return [
						Animated.timing(
							activityState,
							{
								toValue,
								duration,
								easing: Easing.ease,
								useNativeDriver: true
							}
						),
						Animated.timing(
							animation,
							{
								toValue: toValue * (nextIndex > index && index !== nextIndex ? -1 : 1),
								duration,
								easing: Easing.ease,
								useNativeDriver: true
							}
						)
					];
				})
				.flat()
			).start();
		}
	}, [duration, nextIndex, animated, childs.length]);

	return (
		<ScreenContainer
			style={Styles.screen}
		>
			{ 
				childs
				.map((child, index) => {
					const { props, key } = child;
					if ( !matchRef.current ) {
						getMatchRef(props, index);
					}

					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const match = matchRef.current?.index === index ? matchRef.current?.match : undefined;

					const isFocused = Boolean(match);
				
					const _historyMode = props.historyMode ?? historyMode ?? ['push'];

					childKeysRef.current[index] = isFocused && (_historyMode.includes(action as typeof _historyMode[number]) || _historyMode.includes('ALL')) 
						? `${Date.now()}` 
						: (childKeysRef.current[index] ?? key ?? `${index}`);

					return (
						<Route
							{...props}
							key={childKeysRef.current[index]} 
							// @ts-expect-error computedMatch does exist but I want it so be exclusive to switch
							_isInsideSwitch={true}
							activityState={
								animated 
									? animationRef[index].activityState.interpolate({
										inputRange: [0, 1 - 1e-5, 1],
										outputRange: [
											1, // screen visible during transition
											1,
											0 // the screen is detached after transition
										],
										extrapolate: 'extend'
									}) : (
										isFocused ? 1 : 0
									)
							}
							computedMatch={match}
							style={[
								props.style, 
								isFocused 
									? {
										zIndex: 1
									} 
									: StyleSheet.absoluteFill,							
								animated && isFocused && animation(animationRef[index].animation, windowDimensions)
							]}
						>
							<IsFocusedContext.Provider value={isFocused}>
								{
									cloneElement(child, {
										// @ts-expect-error _hideScreen does exist but I want it so be exclusive to switch
										_hideScreen: true 
									})
								}
							</IsFocusedContext.Provider>
						</Route>
					);
				})
			}
		</ScreenContainer>
	);
};
