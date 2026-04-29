import {
	type FC,
	type JSX,
	type ReactNode,
	useEffect,
	useRef
} from 'react';
import { Animated, Easing, View } from 'react-native';

import { type NavigateOptions } from '@resourge/history-store/mobile';

import { useMatchPath } from '../../../hooks/useMatchPath';
import { useNavigate } from '../../../hooks/useNavigate/useNavigate.native';
import { type NavigateMethod } from '../../../hooks/useNavigate/useNavigateType';
import TabBarItem from '../tabBarItem/TabBarItem.native';

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
			icon: ((props: { animation: Animated.Value }) => JSX.Element) | ReactNode
			isFocused?: boolean
			label: string
			path: string
		}
	) => ReactNode
	renderTabBarItem?: (
		props: {
			children: ReactNode
			onPress: () => void
		}
	) => ReactNode
};

export type TabBarItemContainerProps = CommonTabProps & {
	icon: ((props: { animation: Animated.Value }) => JSX.Element) | ReactNode
	label: string
	path: string
};

/**
 * @default path will default to TabRoute path
 */
export type TabDefaultAction = (path?: string) => void;

const TabBarItemContainer: FC<TabBarItemContainerProps> = ({
	animated, duration = 350, icon, label, onPress: _onPress, path,
	renderLabel = ({
		animation, icon, isFocused, label
	}) => (
		<View>
			{
				typeof icon === 'function'
					? icon({
						animation
					})
					: icon
			}
			<Animated.Text
				style={{
					fontWeight: isFocused
						? 'bold'
						: 'normal'
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
		animation: animationRef.current,
		icon,
		isFocused: Boolean(match),
		label,
		path
	});

	useEffect(() => {
		if ( animated && !renderLabel && match ) {
			Animated.timing(animationRef.current, {
				duration,
				easing: Easing.linear,
				toValue: 1,
				useNativeDriver: true
			}).start();

			return () => {
				Animated.timing(animationRef.current, {
					duration,
					easing: Easing.linear,
					toValue: 0,
					useNativeDriver: true
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
