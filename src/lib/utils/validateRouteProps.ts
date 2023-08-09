import invariant from 'tiny-invariant';

import { type MatchRouteProps } from '../hooks';

export const validateRouteProps = (matchProps: Partial<MatchRouteProps>) => {
	matchProps.path = matchProps.path ? matchProps.path : '';
	invariant(
		(
			(
				matchProps.hash === true && (
					(
						Array.isArray(matchProps.path) &&
						matchProps.path.find((p) => p.startsWith('#'))
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
					) || (
						typeof matchProps.path === 'string' &&
						matchProps.path.startsWith('#')
					)
				)
			) || (
				matchProps.hash !== true && (
					(
						Array.isArray(matchProps.path) &&
						matchProps.path.every((p) => !p.startsWith('#'))
					) || (
						typeof matchProps.path === 'string' &&
						!matchProps.path.startsWith('#')
					)
				)
			)
		), 
		typeof matchProps.path === 'string' 
			? `Path '${matchProps.path}' ${matchProps.hash === true ? 'doesn\'t start' : 'start'} with # but 'Route' ${matchProps.hash === true ? 'has' : 'doesn\'t have'} prop hash.`
			: `Paths '${(matchProps.path ?? []).filter((p) => p.startsWith('#')).join(', ')}' start with # but 'Route' doesn't have prop hash.`
	);
}
