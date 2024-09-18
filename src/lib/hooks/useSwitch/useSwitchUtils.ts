import { type RedirectProps } from '../../components';
import { type NavigateProps } from '../../components/navigate/Navigate';
import { type BaseRouteProps } from '../../components/route/RouteUtils';
import { validateRouteProps } from '../../utils/validateRouteProps';
import { matchRoute, type MatchPathProps } from '../useMatchPath';

export type SwitchRouteProps = BaseRouteProps | RedirectProps | NavigateProps;

export const isNavigateOrRedirect = (props: RedirectProps | NavigateProps) => {
	return props.to !== undefined;
};

export const getMatchFromProps = (
	url: URL, 
	props: SwitchRouteProps,
	base: string | undefined
) => {
	if ( process.env.NODE_ENV === 'development' ) {
		if ( 
			!(
				(props as RedirectProps).to
				|| !(props as BaseRouteProps).path
				|| (props as BaseRouteProps).path
			) 
		) {
			throw new Error('`useSwitch` can only accept component\'s with `path`, `search`, `from` or `to` attributes');
		}
	}
	const path: string | string[] | undefined = (props as BaseRouteProps).path ?? (props as RedirectProps).from;
	if ( path ) {
		if ( process.env.NODE_ENV === 'development' ) {
			validateRouteProps({
				...(props as BaseRouteProps),
				path
			});
		}
		
		return matchRoute(url, props as MatchPathProps, path, base);
	}

	return matchRoute(url, props as MatchPathProps, '*');
};
