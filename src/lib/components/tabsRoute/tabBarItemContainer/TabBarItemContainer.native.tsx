import React, {
	type JSX,
	useEffect,
	useRef,
	type ReactNode
} from 'react';
import { Animated, Easing, View } from 'react-native';

import { type NavigateOptions } from '@resourge/history-store/mobile';

import { useMatchPath } from '../../../hooks/useMatchPath';
import { useNavigate } from '../../../hooks/useNavigate/useNavigate.native';
import { type NavigateMethod } from '../../../hooks/useNavigate/useNavigateType';
import TabBarItem from '../tabBarItem/TabBarItem.native';

/**
 * @default path will default to TabRoute path
 */
export type TabDefaultAction = (path?: string) => void;

export type CommonTabProps = {
	/**
	 * Show animation when switching Screens
	 * @default true
	 * @platform mobile
	 */
	animated?: boolean
	/**
	 * Animation duration
	 * @default 350
	 * @platform mobile
	 */
	duration?: number
	onPress?: (
		action: {
			navigate: NavigateMethod<NavigateOptions>
			path: string
		}, 
		defaultAction: TabDefaultAction
	) => void
	renderLabel?: (
		props: {
			animation: Animated.Value
			icon: ReactNode | ((props: { animation: Animated.Value }) => JSX.Element)
			label: string
			path: string
			isFocused?: boolean
		}
	) => ReactNode
	renderTabBarItem?: (
		props: {
			children: ReactNode
			onPress: () => void
		}
	) => ReactNode
};

export type TabBarItemContainerProps = {
	icon: ReactNode | ((props: { animation: Animated.Value }) => JSX.Element)
	label: string
	path: string
} & CommonTabProps;

const TabBarItemContainer: React.FC<TabBarItemContainerProps> = ({
	label, path, icon, onPress: _onPress, animated, duration = 350,
	renderLabel = ({
		label, animation, icon, isFocused
	}) => (
		<View>
			{
				typeof icon === 'function' ? icon({
					animation
				}) : icon
			}
			<Animated.Text
				style={{
					fontWeight: isFocused ? 'bold' : 'normal'
				}}
			>
				{ label }
			</Animated.Text>
		</View>
	), 
	renderTabBarItem = ({ children, onPress }) => (
		<TabBarItem
			onPress={onPress}
		>
			{ children }
		</TabBarItem>
	)
}) => {
	const animationRef = useRef(new Animated.Value(0));
	const navigate = useNavigate();
	const match = useMatchPath({
		path
	});

	const onPress = () => {
		const defaultHandler: TabDefaultAction = (_path = path) => {
			navigate(
				_path, 
				{
					action: 'stack' 
				}
			);
		};
		if ( _onPress ) {
			return _onPress(
				{
					navigate,
					path
				}, 
				defaultHandler
			);
		}

		return defaultHandler();
	};

	const _label = renderLabel({
		icon,
		path,
		label,
		animation: animationRef.current,
		isFocused: Boolean(match)
	});

	useEffect(() => {
		if ( animated && !renderLabel && match ) {
			Animated.timing(animationRef.current, {
				toValue: 1,
				duration,
				useNativeDriver: true,
				easing: Easing.linear
			}).start();

			return () => {
				Animated.timing(animationRef.current, {
					toValue: 0,
					duration,
					useNativeDriver: true,
					easing: Easing.linear
				}).start();
			};
		}
	}, [renderLabel, match, animated, duration]);

	return renderTabBarItem({
		children: _label,
		onPress
	});
};

export default TabBarItemContainer;
