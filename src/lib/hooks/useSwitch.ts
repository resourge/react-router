import { Children, type ReactElement, cloneElement } from 'react';

import invariant from 'tiny-invariant';

import { type NavigateProps } from '../components/Navigate';
import { type RedirectProps } from '../components/Redirect';
import { type BaseRouteProps } from '../components/Route';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';
import { validateRouteProps } from '../utils/validateRouteProps';

import { type MatchPathProps, matchRoute } from './useMatchPath';

type Props = BaseRouteProps | RedirectProps | NavigateProps;

const isNavigateOrRedirect = (props: RedirectProps | NavigateProps) => {
	return props.to !== undefined;
};

const isRoute = (
	props: Props
) => {
	return (
		!isNavigateOrRedirect(props as RedirectProps)
	);
};

const getMatchFromProps = (
	url: URL, 
	props: Props,
	base: string | undefined
) => {
	if ( __DEV__ ) {
		invariant(
			(props as NavigateProps).to
			|| !(props as BaseRouteProps).path
			|| (props as BaseRouteProps).path,
			'`useSwitch` can only accept component\'s with `path`, `search`, `from` or `to` attributes'
		);
	}
	const path = (props as BaseRouteProps).path ?? (props as RedirectProps).from;
	if ( path ) {
		if ( __DEV__ ) {
			validateRouteProps({
				...(props as BaseRouteProps),
				path
			});
		}
		
		return matchRoute(url, props as MatchPathProps, path, base);
	}

	return matchRoute(url, props as MatchPathProps, '*');
};

/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
export const useSwitch = (children: Array<ReactElement<Props>> | ReactElement<Props>): ReactElement<BaseRouteProps> | null => {	
	const { url } = useRouter();
	const baseContext = useLanguageContext();

	const childArray = Children.toArray(children) as Array<ReactElement<Props>>;

	for (let i = 0; i < childArray.length; i++) {
		const child = childArray[i];

		if ( isRoute(child.props) && (child.props as BaseRouteProps).path === undefined ) {
			return child as unknown as ReactElement<BaseRouteProps>;
		}
	
		const match = getMatchFromProps(url, child.props, baseContext);

		if ( match ) {
			return cloneElement(child, {
				// @ts-expect-error computedMatch does exist but I want it so be exclusive to switch
				computedMatch: match 
			}) as unknown as ReactElement<BaseRouteProps>;
		}
	}

	return null;
};
