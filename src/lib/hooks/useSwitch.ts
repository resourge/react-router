import { Children, ReactElement, cloneElement } from 'react';

import invariant from 'tiny-invariant'

import { NavigateProps } from '../components/Navigate';
import { RedirectProps } from '../components/Redirect';
import { BaseRouteProps } from '../components/Route';
import { BaseSearchRouteProps } from '../components/SearchRoute';
import { RouteContextObject, useRoute } from '../contexts/RouteContext';
import { useUrl } from '../contexts/RouterContext';
import { validateRouteProps } from '../utils/validateRouteProps';

import { matchRoute } from './useMatchRoute';
import { matchSearchRoute } from './useSearchRoute';

type Props = BaseRouteProps | BaseSearchRouteProps | RedirectProps | NavigateProps;

const getMatchFromProps = (
	url: URL, 
	parentRoute: RouteContextObject<Record<string, string>>, 
	props: Props
) => {
	if ( __DEV__ ) {
		invariant(
			(props as BaseRouteProps).path ||
			(props as BaseSearchRouteProps).search ||
			(props as RedirectProps).from ||
			(props as NavigateProps).to,
			'`useSwitch` can only accept component\'s with `path`, `search`, `from` or `to` attributes'
		);
	}

	const path = (props as BaseRouteProps).path ?? (props as RedirectProps).from
	if ( path ) {
		validateRouteProps({
			...(props as BaseRouteProps),
			path
		})
		
		return matchRoute(url, {
			...props,
			path,
			exact: true
		}, parentRoute)
	}
	const searchBaseProps = (props as BaseSearchRouteProps)
	if ( searchBaseProps.search ) {
		return matchSearchRoute(url, {
			...searchBaseProps,
			exact: true
		}, parentRoute)
	}

	return matchRoute(url, {
		...searchBaseProps,
		path: '*',
		exact: true
	}, parentRoute)
}

/**
 * Returns the first children component who props `path` or `search` matches the current location.
 */
export const useSwitch = (children: Array<ReactElement<Props>> | ReactElement<Props>): ReactElement<BaseRouteProps> | null => {	
	const url = useUrl()
	const parentRoute = useRoute();

	const childArray = Children.toArray(children) as Array<ReactElement<Props>>;

	for (let i = 0; i < childArray.length; i++) {
		const child = childArray[i];

		const match = getMatchFromProps(url, parentRoute, child.props);

		if ( match ) {
			return cloneElement(child, {
				// @ts-expect-error computedMatch does exist but I want it so be exclusive to switch
				computedMatch: match 
			}) as unknown as ReactElement<BaseRouteProps>;
		}
	}

	return null;
}
