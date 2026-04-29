import {
	Children,
	type JSX,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
	type Ref,
	useMemo
} from 'react';
import { View } from 'react-native';

import { TabConfigContext, type TabProps } from '../../contexts/TabConfigContext';
import { Styles } from '../../utils/Styles.native';
import Route, { type RouteProps } from '../route/Route.native';
import Switch from '../switch/Switch.native';

import TabBar, { type TabBarPropsPlacement } from './tabBar/TabBar.native';
import TabBarItemContainer, { type CommonTabProps, type TabBarItemContainerProps } from './tabBarItemContainer/TabBarItemContainer.native';

export type TabRouteTabProps = CommonTabProps & Omit<RouteProps, 'path'> 
	& TabProps
	& { 
		label: string
		path: string
	};

export type TabsRouteProps = CommonTabProps & PropsWithChildren 
	& TabProps
	& { 
		placement: TabBarPropsPlacement
		renderTabBar?: (
			props: {
				children: Array<ReactElement<TabRouteTabProps>>
				placement: TabBarPropsPlacement
				tabs: TabRouteTabProps[]
			}
		) => ReactNode
	};

/**
 * `TabsRoute` provides a customizable tab navigation component. 
 * It includes functionalities to render tabs and switch between different views seamlessly. 
 * Supports customizable tab bars and can accommodate various configurations based on user requirements.
 */
function TabsRoute(
	{
		animated, children, duration, 
		historyMode,
		onPress,
		placement,
		renderLabel,
		renderTabBar = ({ children, placement }) => (
			<TabBar
				placement={placement}
			>
				{ children }
			</TabBar>
		),
		renderTabBarItem
	}: TabsRouteProps
) {
	const childs = Children.toArray(children) as Array<ReactElement<TabBarItemContainerProps> & { ref?: Ref<any> }>;

	const Screens = (
		<Switch>
			{ children as any }
		</Switch>
	);

	const isTop = placement === 'TOP';

	const value = useMemo(() => ({
		historyMode
	}), [historyMode]);

	return (
		<TabConfigContext.Provider value={value}>
			<View
				style={Styles.screen}
			>
				{ 
					isTop
						? (<></>)
						: Screens 
				}
				{
					renderTabBar({
						get children() {
							return childs
							.map(({ props }) => (
								<TabBarItemContainer
									animated={props.animated ?? animated}
									duration={props.duration ?? duration}
									icon={props.icon}
									key={props.path}
									label={props.label}
									onPress={props.onPress ?? onPress}
									path={props.path}
									renderLabel={(props.renderLabel ?? renderLabel)}
									renderTabBarItem={props.renderTabBarItem ?? renderTabBarItem}
								/>
							));
						},
						placement,
						get tabs() {
							return childs.map(({ props }) => props);
						}
					})
				}
				{ isTop
					? Screens
					: (<></>) }
			</View>
		</TabConfigContext.Provider>
	);
}

TabsRoute.Tab = Route as (props: TabRouteTabProps) => JSX.Element;

export default TabsRoute;
