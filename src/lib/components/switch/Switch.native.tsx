import {
	type ReactNode,
	Suspense,
	type FC,
	Children,
	type ReactElement
} from 'react';
import {
	type Animated,
	type ScaledSize,
	type StyleProp,
	type ViewStyle
} from 'react-native';

import { ScreenContainer } from 'react-native-screens';

import { useDefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { type TabProps } from '../../contexts/TabConfigContext';
import { type UseSwitchProps } from '../../hooks/useSwitch/useSwitch.native';
import { useSwitch } from '../../hooks/useSwitch/useSwitch.native';
import { Styles } from '../../utils/Styles.native';
import AnimatedRoute from '../animatedRoute/AnimatedRoute';
import { type RouteProps } from '../index.native';

export type SwitchProps = UseSwitchProps & {
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
	fallback?: ReactNode
};

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch: FC<SwitchProps> = ({
	children,
	animated,
	animation,
	duration,
	fallback
}: SwitchProps) => {
	const {
		matchRef, match, side 
	} = useSwitch({
		children 
	});
	const defaultFallback = useDefaultFallbackContext();

	return (
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		<Suspense fallback={fallback || defaultFallback}>
			<ScreenContainer
				style={Styles.screen}
			>
				{
					(Children.toArray(children) as Array<ReactElement<RouteProps & TabProps>>)
					.map((child, index) => {
						const { props } = child;
						const isFocused = Boolean(matchRef.current === index);
				
						return (
							<AnimatedRoute
								key={index}
								animated={animated}
								animation={animation}
								duration={duration}
								isFocused={isFocused}
								match={isFocused ? match : null}
								side={side}
								{...props}
							>
								{ child }
							</AnimatedRoute>
						);
					})
				}
			</ScreenContainer>
		</Suspense>
	);
};

export default Switch;
