import invariant from 'tiny-invariant';

import { type MatchRouteProps } from '../hooks/useMatchRoute';

export const validateRouteProps = (matchProps: Partial<MatchRouteProps>) => {
	const path = matchProps.path ? matchProps.path : '';

	const paths = (Array.isArray(path) ? path : [path])
	.map((p) => typeof p === 'object' ? p.path : p)
	.filter((p) => p);

	invariant(
		(
			(
				matchProps.hash === true && (paths.some((p) => p.startsWith('#')))
			) || (
				matchProps.hash !== true && paths.every((p) => !p.startsWith('#'))
			)
		), 
		paths.length === 1 
			? `Path '${paths[0]}' ${matchProps.hash === true ? 'doesn\'t start' : 'start'} with # but 'Route' ${matchProps.hash === true ? 'has' : 'doesn\'t have'} prop hash.`
			: `Paths '${paths.map((p) => p.startsWith('#')).join(', ')}' start with # but 'Route' doesn't have prop hash.`
	);
}
