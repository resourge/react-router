import { PathType, Path } from './Path';

type PathStructures = Record<string, Path<any, any>>

export type SetupPathsResult<R extends PathStructures> = { 
	[K in keyof R]: PathType<R[K]['subPaths'], R[K]['_params']> 
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
