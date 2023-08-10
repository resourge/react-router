import {
	cloneElement,
	Suspense,
	type ReactElement,
	type ReactNode
} from 'react'

import { RouteContext, useRoute } from '../contexts/RouteContext';
import { useMatchRoute, type MatchRouteProps } from '../hooks/useMatchRoute';
import { generatePath } from '../utils/generatePath';
import { getUrlPattern } from '../utils/getUrlPattern';
import { type MatchResult } from '../utils/matchPath';
import { resolveSlash } from '../utils/resolveLocation';

import Navigate from './Navigate';

type GetParams<Base extends string> = 
		Base extends `${infer E}/`
			? [E]
			: Base extends `${infer E}/${infer R}`
				? [E, ...ParamsFromBasePath<R>]
				: Base extends `${infer E}(${infer R}`
					? [E, ...(R extends `)${infer R2}` ? ParamsFromBasePath<R2> : [])]
					: Base extends `${infer R}:${infer E}` 
						? [R, ...ParamsFromBasePath<`:${E}`>]
						: Base extends `${infer E}`
							? [E]
							: []

type ParamsFromBasePath<Base extends string> = 
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	Base extends `${infer _R}:${infer E}` 
		? [...GetParams<E>]
		: []

type Primitive = bigint | boolean | null | number | string | symbol | undefined;

type SetParamsToObject<Base extends string> = {
	[K in ParamsFromBasePath<Base>[number]]: Primitive
} & Record<string, Primitive>

export type RouteProps<Base extends string> = Omit<MatchRouteProps, 'path'> & 
{ 
	base: Base
	params?: {
		check?: (params: SetParamsToObject<Base>) => boolean | 'REMOVE_CURRENT_PARAMS'
		fallback?: () => SetParamsToObject<Base>
	}
} & 
{ fallback?: ReactNode } & 
({
	children: ReactNode
	
	component?: ReactElement
} | ({
	component: ReactElement
	children?: ReactNode
}))

export type IRouteProps<Base extends string> = RouteProps<Base> & {
	computedMatch?: MatchResult | null
}

/**
 * Base Route is a route that, contrary to a normal route, it will always match. 
 * In case the "base" path doesn't match it will add the base to href depending on the parent route(if exists)
 */
export function BaseRoute<Base extends string>({
	children, component,
	computedMatch,
	fallback,
	base, params,
	exact, hash
}: IRouteProps<Base>) {
	const parentRoute = useRoute();

	const match = useMatchRoute(
		{
			path: base,
			exact,
			hash 
		}, 
		computedMatch
	);

	const _params = match && match !== 'NO_ROUTE' ? match.getParams() : {}
	const _check = params?.check && params?.check(_params)

	if ( !match || (match && (_check === false || _check === 'REMOVE_CURRENT_PARAMS')) ) {
		const urlPattern = getUrlPattern({
			path: parentRoute.path,
			exact: false,
			hash,
			hashPath: parentRoute.hashPath,
			baseURL: parentRoute.baseURL
		})

		const url = new URL(window.location.href);

		const previousInstanceMatch = urlPattern.exec(url.href);

		let nextPath = previousInstanceMatch?.pathname.groups[0] ?? '';
		const previousPath = previousInstanceMatch?.pathname.input.replace(nextPath, '') ?? '';

		const newParams = params?.fallback ? params.fallback() : {};
		let newBase = ''

		if ( _check === 'REMOVE_CURRENT_PARAMS' ) {
			Object.entries(_params)
			.forEach(([key, param]) => {
				nextPath = nextPath.replace(param, (newParams as any)[key] ?? '')
			})
		}
		else {
			newBase = generatePath(base, newParams);
		}

		const newPathname = resolveSlash(previousPath, newBase, nextPath);

		if ( !hash ) {
			url.pathname = newPathname;
		}
		else {
			url.hash = newPathname;
		}

		return (
			<Navigate 
				replace={true}
				to={url.href}
			/>
		)
	}

	const Component = (
		<Suspense fallback={fallback}>
			{ component ? cloneElement(component, {}, component.props.children, children) : children }
		</Suspense>
	)
		
	if ( match === 'NO_ROUTE' ) {
		return (
			<>
				{ Component }
			</>
		)
	}

	return (
		<RouteContext.Provider value={match}>
			{ Component }
		</RouteContext.Provider>
	)
};

export default BaseRoute;
