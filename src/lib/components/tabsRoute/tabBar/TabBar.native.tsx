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
			style={[styles.tabBar, placement === 'BOTTOM' ? styles.tabBarBottom : styles.tabBarTop]}
		>
			{ children }
		</View>
	);
};

export default TabBar;

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: 'row',
		borderBottomColor: '#bbb',
		borderBottomWidth: StyleSheet.hairlineWidth,
		gap: 10,
		justifyContent: 'space-around'
	},
	tabBarBottom: {
		borderTopColor: '#bbb',
		borderTopWidth: StyleSheet.hairlineWidth
	},
	tabBarTop: {
		borderBottomColor: '#bbb',
		borderBottomWidth: StyleSheet.hairlineWidth
	}
});
