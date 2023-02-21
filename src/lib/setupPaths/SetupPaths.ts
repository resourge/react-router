import { type PathType, type Path } from './Path';

type PathStructures = Record<string, Path<any, any, any, boolean>>

export type SetupPathsResult<R extends PathStructures> = { 
	// @ts-expect-error Want to protect value, but also access it with types
	[K in keyof R]: PathType<R[K]['_routes'], R[K]['_params'], R[K]['_useParams']> 
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
