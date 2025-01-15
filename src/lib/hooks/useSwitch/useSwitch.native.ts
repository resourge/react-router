import { Children, type LegacyRef, type ReactElement } from 'react';

import { type RouteProps } from '../../components/route/Route.native';
import { type BaseRouteProps } from '../../components/route/RouteUtils';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';
import { type TabProps } from '../../contexts/TabConfigContext';

import { type SwitchRouteProps, getMatchFromProps, isNavigateOrRedirect } from './useSwitchUtils';

export type UseSwitchProps = {
	children: Array<ReactElement<SwitchRouteProps>> | ReactElement<SwitchRouteProps>
};

/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
export const useSwitch = ({ children }: UseSwitchProps) => {
	const { url } = useRouter();
	const baseContext = useLanguageContext();
	const childArray = Children.toArray(children) as Array<ReactElement<RouteProps & TabProps> & { ref?: LegacyRef<any> }>;
	
	for (let index = 0; index < childArray.length; index++) {
		const { props } = childArray[index];

		const match = getMatchFromProps(
			url, 
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			!isNavigateOrRedirect(props as any) && (props as BaseRouteProps).path === undefined 
				? {
					path: '*'
				} : props, 
			baseContext
		);

		if ( match ) {
			return {
				currentIndex: index,
				match
			} as const;
		}
	}
	
	return {
		currentIndex: null,
		match: null
	} as const;
};
