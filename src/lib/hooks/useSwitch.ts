import { cloneElement, isValidElement, PropsWithChildren, ReactElement, ReactNode } from 'react';

import { UseMatchConfig, useMatch } from './useMatch';

/**
 * Returns the first children component who props `path` matches the current location.
 */
export const useSwitch = (children: ReactNode[]) => {
	const match = useMatch()

	for (let i = 0; i < children.length; i++) {
		const child = children[i] as ReactElement<PropsWithChildren<{ path: string } & UseMatchConfig>>;
		const { path, children: _children, ...matchPathConfig } = child.props;
		
		if ( 
			isValidElement(child) && 
			path 
		) {
			if ( 
				match(path, matchPathConfig).match
			) {
				return cloneElement(child, { })
			}
		}
	}

	return null;
} 
