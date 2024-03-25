import { type IsHashPath, type IncludeSlash } from '../types/StringTypes';

import { type PathType, type Path } from './Path';

type PathStructures = Record<string, Path<any, string>>

export type SetupPathsResult<R extends PathStructures> = { 
	[K in keyof R]: PathType<
		IsHashPath<R[K]['_key']> extends true 
			? R[K]['_key']
			: IncludeSlash<R[K]['_key']>, 
		R[K]['_params'], 
		R[K]['_paramsResult'], 
		R[K]['_routes']
	> 
}

/**
 * Creates the path's structure.
 * @param paths {R} - object with path's structure.
 */
export const SetupPaths = <R extends PathStructures>(paths: R): SetupPathsResult<R> => {
	return Object.entries(paths)
	.reduce((obj, [key, value]) => {
		// @ts-expect-error I want createPath as private for use
		(obj as any)[key] = value.createPath();
		return obj;
	}, {}) as SetupPathsResult<R>;
};
