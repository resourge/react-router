import React from 'react';
import {
	Animated,
	Easing,
	Platform,
	Pressable,
	StyleSheet,
	useColorScheme,
	type GestureResponderEvent,
	type PressableProps,
	type StyleProp,
	type ViewStyle
} from 'react-native';

export type TabBarItemProps = Omit<PressableProps, 'style'> & {
	children: React.ReactNode
	pressColor?: string
	pressOpacity?: number
	style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>
};

const SPACING = 5;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE = Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

const TabBarItem: React.FC<TabBarItemProps> = ({
	disabled,
	onPress,
	onPressIn,
	onPressOut,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	android_ripple = {
		borderless: true 
	},
	pressColor,
	pressOpacity = 1,
	style,
	...rest
}) => {
	const color = useColorScheme();
	const isDark = color === 'dark';

	const [opacity] = React.useState(() => new Animated.Value(1));

	const animateTo = (toValue: number, duration: number) => {
		if (ANDROID_SUPPORTS_RIPPLE) {
			return;
		}

		Animated.timing(opacity, {
			toValue,
			duration,
			easing: Easing.inOut(Easing.quad),
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
			accessibilityRole="button"
			accessible
			android_ripple={
				ANDROID_SUPPORTS_RIPPLE
					? {
						color: pressColor ?? (
							isDark
								? 'rgba(255, 255, 255, .32)'
								: 'rgba(0, 0, 0, .32)'
						),
						...android_ripple
					}
					: undefined
			}
			style={[
				styles.item,
				{
					opacity: !ANDROID_SUPPORTS_RIPPLE ? opacity : 1 
				}, 
				style
			]}
			onPress={disabled ? undefined : onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			{...rest}
		/>
	);
};

const styles = StyleSheet.create({
	item: {
		flex: 1,
		padding: SPACING * 2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default TabBarItem;
