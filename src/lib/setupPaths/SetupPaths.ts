import { type IsHashPath, type IncludeSlash } from '../types/StringTypes'

import { type PathType, type Path } from './Path'

type PathStructures = Record<string, Path<any, string>>

export type SetupPathsResult<R extends PathStructures> = { 
	[K in keyof R]: PathType<
		// @ts-expect-error Want to protect value, but also access it with types
		IsHashPath<R[K]['_key']> extends true 
			// @ts-expect-error Want to protect value, but also access it with types
			? R[K]['_key']
			// @ts-expect-error Want to protect value, but also access it with types
			: IncludeSlash<R[K]['_key']>, 
		// @ts-expect-error Want to protect value, but also access it with types
		R[K]['_configParams'], 
		// @ts-expect-error Want to protect value, but also access it with types
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
	}, {}) as SetupPathsResult<R>
}
