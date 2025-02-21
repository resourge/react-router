import { Children, cloneElement, type ReactElement } from 'react';

import { type RedirectProps } from '../../components/redirect/Redirect';
import { type BaseRouteProps } from '../../components/route/RouteUtils';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useRouter } from '../../contexts/RouterContext';
import { getNavigate } from '../../utils/getNavigate/getNavigate';

import {
	type SwitchRouteProps,
	getMatchFromProps,
	isIndexRoute,
	isNavigateOrRedirect
} from './useSwitchUtils';

export type UseSwitchProps = {
	children: Array<ReactElement<SwitchRouteProps>> | ReactElement<SwitchRouteProps>
};

/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
export const useSwitch = ({ children }: UseSwitchProps): ReactElement<BaseRouteProps> | null => {	
	const { url } = useRouter();
	const baseContext = useLanguageContext();

	const childArray = Children.toArray(children) as Array<ReactElement<SwitchRouteProps>>;

	let indexRoute: JSX.Element | null = null;

	for (let i = 0; i < childArray.length; i++) {
		const child = childArray[i];
		const props = child.props as BaseRouteProps;

		indexRoute = isIndexRoute(props, indexRoute, getNavigate);

		if ( !isNavigateOrRedirect(props as RedirectProps) && props.path === undefined ) {
			return child as unknown as ReactElement<BaseRouteProps>;
		}
	
		const match = getMatchFromProps(url, props, baseContext);

		if ( match ) {
			return cloneElement(child, {
				// @ts-expect-error computedMatch does exist but I want it so be exclusive to switch
				computedMatch: match 
			}) as unknown as ReactElement<BaseRouteProps>;
		}
	}

	return indexRoute;
};
