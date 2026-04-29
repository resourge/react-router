import { type FC, type ReactNode, useState } from 'react';
import {
	Animated,
	Easing,
	type GestureResponderEvent,
	Platform,
	Pressable,
	type PressableProps,
	type StyleProp,
	StyleSheet,
	useColorScheme,
	type ViewStyle
} from 'react-native';

export type TabBarItemProps = Omit<PressableProps, 'style'> & {
	children: ReactNode
	pressColor?: string
	pressOpacity?: number
	style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>
};

const SPACING = 5;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANDROID_SUPPORTS_RIPPLE = Platform.OS === 'android' && Platform.Version >= 21; // 21 ANDROID_VERSION_LOLLIPOP;

const TabBarItem: FC<TabBarItemProps> = ({
	android_ripple = {
		borderless: true 
	},
	disabled,
	onPress,
	onPressIn,
	onPressOut,
	pressColor,
	pressOpacity = 1,
	style,
	...rest
}) => {
	const isDark = useColorScheme() === 'dark';
	const defaultPressColor = isDark
		? 'rgba(255, 255, 255, .32)'
		: 'rgba(0, 0, 0, .32)';

	const [opacity] = useState(() => new Animated.Value(1));

	const animateTo = (toValue: number, duration: number) => {
		if (ANDROID_SUPPORTS_RIPPLE) {
			return;
		}

		Animated.timing(opacity, {
			duration,
			easing: Easing.inOut(Easing.quad),
			toValue,
			useNativeDriver: true
		}).start();
	};

	const handlePressIn = (e: GestureResponderEvent) => {
		animateTo(pressOpacity, 0);
		onPressIn?.(e);
	};

	const handlePressOut = (e: GestureResponderEvent) => {
		animateTo(1, 200);
		onPressOut?.(e);
	};

	return (
		<AnimatedPressable
			accessibilityRole={'button'}
			accessible
			android_ripple={
				ANDROID_SUPPORTS_RIPPLE
					? {
						color: pressColor ?? defaultPressColor,
						...android_ripple
					}
					: undefined
			}
			onPress={disabled
				? undefined
				: onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={[
				styles.item,
				{
					opacity: ANDROID_SUPPORTS_RIPPLE
						? 1
						: opacity
				}, 
				style
			]}
			{...rest}
		/>
	);
};

const styles = StyleSheet.create({
	item: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		padding: SPACING * 2
	}
});

export default TabBarItem;
