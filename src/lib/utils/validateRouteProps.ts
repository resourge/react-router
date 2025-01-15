import { type MatchPathProps } from '../hooks/useMatchPath';

export const validateRouteProps = (matchProps: Partial<MatchPathProps>) => {
	const path = matchProps.path ?? '';

	const paths = (Array.isArray(path) ? path : [path])
	.filter((p) => p);

	if ( process.env.NODE_ENV === 'development' ) {
		const hasHashProp = matchProps.hash === true;
		const pathsStartWithHash = paths.some((p) => p.startsWith('#'));

		if ((hasHashProp && !pathsStartWithHash) || (!hasHashProp && pathsStartWithHash)) {
			throw new Error(
				paths.length === 1 
					? `Path '${paths[0]}' ${matchProps.hash === true ? 'doesn\'t start' : 'start'} with # but 'Route' ${matchProps.hash === true ? 'has' : 'doesn\'t have'} prop hash.`
					: `Paths '${paths.map((p) => p.startsWith('#')).join(', ')}' start with # but 'Route' doesn't have prop hash.`
			);
		}
	}
};
