import { type RedirectProps } from '../../components';
import { type NavigateProps } from '../../components/navigate/Navigate';
import { type BaseRouteProps } from '../../components/route/RouteUtils';
import { validateRouteProps } from '../../utils/validateRouteProps';
import { matchRoute, type MatchPathProps } from '../useMatchPath';

export type SwitchRouteProps = BaseRouteProps | RedirectProps | NavigateProps;
/**
 * Checks if the given props are related to navigation or redirection.
 * @param props - The props to check.
 * @returns `true` if the props contain a `to` attribute indicating navigation or redirection.
 */
export const isNavigateOrRedirect = (props: RedirectProps | NavigateProps) => props.to !== undefined;

/**
 * Matches the current URL against the given route props to determine if it should render the component.
 * @param url - The current URL.
 * @param props - The route props to match.
 * @param base - The base path for the route.
 * @returns The match result if the route matches, otherwise `null`.
 * @throws Error if the props are invalid in development mode.
 */
export const getMatchFromProps = (
	url: URL, 
	props: SwitchRouteProps,
	base: string | undefined
) => {
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

export function isIndexRoute(
	props: BaseRouteProps,
	indexRoute: JSX.Element | null,
	getNavigate: (to: string) => {
		component: JSX.Element
	}
): JSX.Element | null {
	if ( props.index && props.path ) {
		if ( process.env.NODE_ENV === 'development' ) {
			if ( indexRoute ) {
				throw new Error(`Can only exist one index route`);
			}
		}
		const path = typeof props.path === 'string' 
			? props.path 
			: props.path[0];

		indexRoute = getNavigate(path).component;
		
		if ( process.env.NODE_ENV === 'development' ) {
			if ( props.path?.includes(':') ) {
				throw new Error(`Index route ${path} cannot have param's in path`);
			}
		}
	}
	return indexRoute;
}
