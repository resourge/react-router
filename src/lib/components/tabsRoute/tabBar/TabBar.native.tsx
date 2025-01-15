import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export type TabBarPropsPlacement = 'TOP' | 'BOTTOM';

export type TabBarProps = { 
	children: ReactNode
	placement: TabBarPropsPlacement
};

const TabBar: React.FC<TabBarProps> = ({ placement, children }: TabBarProps) => {
	return (
		<View
			accessibilityRole="tablist"
			style={[
				styles.tabBar, 
				{ 
					borderTopWidth: placement === 'BOTTOM' ? StyleSheet.hairlineWidth : 0,
					borderBottomWidth: placement === 'TOP' ? StyleSheet.hairlineWidth : 0
				}
			]}
		>
			{ children }
		</View>
	);
};

export default TabBar;

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: 'row',
		borderColor: '#bbb',
		gap: 10,
		justifyContent: 'space-around'
	}
});
