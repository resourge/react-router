import { type IncludeSlash, type IsHashPath } from '../../types/StringTypes';
import { type PickValue } from '../../types/types';
import { type Path, type PathType } from '../path/Path.native';

type PathStructures = Record<string, Path<any, string, any, any, any>>;

export type SetupPathsResult<R extends PathStructures> = { 
	[K in keyof R]: PathType<
		IsHashPath<PickValue<R[K], '_key'>> extends true
			? PickValue<R[K], '_key'>
			: IncludeSlash<PickValue<R[K], '_key'>>,
		PickValue<R[K], '_params'>,
		PickValue<R[K], '_paramsResult'>,
		PickValue<R[K], '_searchParams'>,
		PickValue<R[K], '_routes'>
	> 
};

/**
 * Creates the path's structure.
 * @param paths {R} - object with path's structure.
 */
export const SetupPaths = <const R extends PathStructures>(paths: R): SetupPathsResult<R> => {
	return Object.entries(paths)
	.reduce((obj, [key, value]) => {
		// @ts-expect-error I want createPath as private for use
		obj[key] = value.createPath();
		return obj;
	}, {}) as SetupPathsResult<R>;
};
