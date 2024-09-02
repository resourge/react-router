import {
	Children,
	type LegacyRef,
	type ReactElement,
	useRef
} from 'react';

import { type BaseRouteProps } from 'src/lib/components/route/RouteUtils';
import { type TabProps } from 'src/lib/contexts/TabConfigContext';

import { type RouteProps } from '../../components/route/Route.native';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';

import { type SwitchRouteProps, getMatchFromProps, isNavigateOrRedirect } from './useSwitchUtils';

export type UseSwitchProps = {
	children: Array<ReactElement<SwitchRouteProps>> | ReactElement<SwitchRouteProps>
};

/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
export const useSwitch = ({ children }: UseSwitchProps) => {	
	const childs = Children.toArray(children) as Array<ReactElement<RouteProps & TabProps> & { ref?: LegacyRef<any> }>;

	const { url } = useRouter();
	const baseContext = useLanguageContext();
	const matchRef = useRef<number | null>(null);
	const previousIndexRef = useRef<number | null>(null);

	const getMatchRef = () => {
		for (let index = 0; index < childs.length; index++) {
			const { props } = childs[index];
			const match = getMatchFromProps(
				url, 
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				!isNavigateOrRedirect(props as any) && (props as BaseRouteProps).path === undefined 
					? {
						path: '/' 
					} : props, 
				baseContext
			);

			if ( match ) {
				if ( matchRef.current !== null ) {
					previousIndexRef.current = matchRef.current;
				}

				matchRef.current = index;

				return match;
			}
		}
		return null;
	};

	const match = getMatchRef();

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const side = previousIndexRef.current! < matchRef.current! ? 'left' : 'right';

	return {
		matchRef,
		match,
		side
	} as const;
};
