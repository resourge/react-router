import {
	cloneElement,
	useEffect,
	useRef,
	type ReactElement
} from 'react';
import {
	Animated,
	Easing,
	type ScaledSize,
	type StyleProp,
	StyleSheet,
	useWindowDimensions,
	type ViewStyle
} from 'react-native';

import { IsFocusedContext } from '../../contexts/IsFocusedContext';
import { useAction } from '../../hooks/useAction';
import { type MatchResult } from '../../utils/matchPath';

type Props = {
	children: ReactElement
	isFocused: boolean
	match: MatchResult<Record<string, string>> | null
	side: 'left' | 'right'
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
	 * @default 200
	 * @platform mobile
	 */
	duration?: number
};

const AnimatedRoute: React.FC<Props> = ({
	children,
	duration = 200,
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
	}),
	match,
	isFocused, 
	side
}) => {
	const windowDimensions = useWindowDimensions();
	const action = useAction();

	const activityStateRef = useRef(new Animated.Value(match ? 0 : 1));
	const animationRef = useRef(new Animated.Value(match ? 0 : 1));
	const isFirstTime = useRef(true);

	const shouldHaveZIndex = (action === 'pop' ? !isFocused : isFocused);

	const animateScreen = (toValue: number) => {
		Animated.parallel([
			Animated.timing(activityStateRef.current, {
				toValue,
				duration,
				easing: Easing.ease,
				useNativeDriver: true
			}),
			Animated.timing(animationRef.current, {
				toValue,
				duration,
				easing: Easing.ease,
				useNativeDriver: true
			})
		]).start();
	};

	useEffect(() => {
		if (isFirstTime.current) {
			isFirstTime.current = false;
			return;
		}
		switch (action) {
			case 'push': case 'replace':
				if (isFocused) {
					animateScreen(0);
				}
				else {
					Animated.timing(activityStateRef.current, {
						toValue: 1,
						duration,
						easing: Easing.ease,
						useNativeDriver: true
					}).start(() => {
						animationRef.current.setValue(1);
					});
				}
				break;
			case 'pop':
				if (isFocused) {
					animationRef.current.setValue(0);
					activityStateRef.current.setValue(0);
				}
				else {
					animateScreen(1);
				}
				break;
			case 'stack':
				if (isFocused) {
					const toValue = 0;
					animationRef.current.setValue((side === 'left' ? 1 : -1));
					Animated.parallel([
						Animated.timing(activityStateRef.current, {
							toValue,
							duration,
							easing: Easing.ease,
							useNativeDriver: true
						}),
						Animated.timing(animationRef.current, {
							toValue,
							duration,
							easing: Easing.ease,
							useNativeDriver: true
						})
					]).start();
				}
				else {
					Animated.parallel([
						Animated.timing(activityStateRef.current, {
							toValue: 0,
							duration,
							easing: Easing.ease,
							useNativeDriver: true
						}),
						Animated.timing(animationRef.current, {
							toValue: (side === 'left' ? -1 : 1),
							duration,
							easing: Easing.ease,
							useNativeDriver: true
						})
					]).start();
				}
				break;
		}
	}, [isFocused]);

	return (
		<IsFocusedContext.Provider
			value={isFocused}
		>
			{
				cloneElement(
					children, 
					{
						_isInsideSwitch: true,
						activityState: animated 
							? activityStateRef.current.interpolate({
								inputRange: [0, 1 - 1e-5, 1],
								outputRange: [
									1, // screen visible during transition
									1,
									0 // the screen is detached after transition
								],
								extrapolate: 'extend'
							}) : (
								isFocused ? 1 : 0
							),							
						computedMatch: match,
						style: [
							children.props.style, 
							shouldHaveZIndex 
								? {
									zIndex: 1
								} 
								: StyleSheet.absoluteFill,							
							animated && animation(animationRef.current, windowDimensions)
						]
					}
				)
			}
		</IsFocusedContext.Provider>
	);
};

export default AnimatedRoute;
