/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import invariant from 'tiny-invariant';

import { StringifyObjectParams, useParams } from 'src/lib/hooks/useParams';
import { generatePath } from 'src/lib/utils/generatePath';

import { Param, ParamsConfig, ParamsConfigOptional } from './Param';

export function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, window.location.origin)

	const windowURL = new URL(window.location as any);
	newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : ''

	return newPath.href;
}

export type PathType<
	Paths extends Record<string, Path<any, any>>, 
	Params extends Record<string, any> | undefined = undefined
> = {
	/**
	 * Method to obtain the true path.
	 * Calling it with `params` will replace the params with the params value on the path.
	 */
	get: string extends keyof Params ? () => string : (params: Params) => string
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: string
} & PathsType<Paths> & (
	string extends keyof Params ? {} : {
		/**
		 * Hook to receive the params related to the route.
		 * Here all the transform method will transform the params to the desired params. 
		 */
		useParams: () => Params
	}
)

export type PathsType<Paths extends Record<string, Path<any, any>>> = {
	[K in keyof Paths]: PathType<Paths[K]['subPaths'], Paths[K]['_params']>
}

/**
 * @important This config is not used in children paths
 */
type PathConfig = {
	/**
	 * Turns the path into a hash path
	 */
	hash?: boolean
	/**
	 * Add's "/modal" to the being of the path and turns the path into a hash path
	 * @example /#/modal
	 */
	hashModal?: boolean
	/**
	 * Add's "/modal" to the being of the path
	 */
	isModal?: boolean
}

export class Path<
	Params extends Record<string, any> = Record<string, any>, 
	SubPaths extends Record<string, Path<any, any>> = Record<string, Path<any, any>>
> {
	public _params!: Params;
	protected config: PathConfig = {}
	protected paths: Array<Param<Params[keyof Params]> | string> = [];
	public subPaths!: SubPaths;
	private _includeCurrentURL?: boolean;

	constructor(config?: PathConfig) {
		this.config = config ?? {};
	}

	protected clone<
		Params extends Record<string, any> = Record<string, any>, 
		SubPaths extends Record<string, Path<any, any>> = Record<string, Path<any, any>>
	>() { 
		const _this = new Path<Params, SubPaths>();

		_this.paths = [...this.paths] as unknown as Array<Param<Params[keyof Params]> | string>;
		_this.subPaths = {
			...this.subPaths
		} as unknown as SubPaths;
		_this._includeCurrentURL = this._includeCurrentURL;
		_this.config = this.config;

		return _this;
	}

	/**
	 * Makes method `get` to return the current path as hash.
	 * @param includeCurrentURL {boolean}
	 */
	public includeCurrentURL(includeCurrentURL?: boolean) {
		const _this = this.clone<Params, SubPaths>();
		_this._includeCurrentURL = includeCurrentURL;
		return _this;
	}

	/**
	 * Add's new value to the path. (Add's the value into the path in the calling other).
	 * @param path {string} - new path part
	 */
	public addPath(path?: string) {
		const _this = this.clone<Params, SubPaths>();
		if ( path ) {
			_this.paths.push(path);
		}
		return _this;
	}

	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		K extends string = string, 
		V extends Params[K] | string | undefined = string
	>(
		value: K
	): Path<
		(string extends keyof Params ? {} : Params) & { [key in K]: V }, 
		SubPaths
	>
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfigOptional<V>} - param configuration.
	 */
	public param<
		K extends string = string, 
		V extends Params[K] | string | undefined = string,
		V1 = Params[K]
	>(
		value: K, 
		config: ParamsConfigOptional<V, V1> 
	): Path<
		(string extends keyof Params ? {} : Params) & { [key in K]?: V }, 
		SubPaths
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<V>} - param configuration.
	 */
	public param<
		K extends string = string,
		V extends Params[K] | string | undefined = string,
		V1 = Params[K]
	>(
		value: K, 
		config: ParamsConfig<V, V1> 
	): Path<
		(string extends keyof Params ? {} : Params) & { [key in K]: V }, 
		SubPaths
	>;

	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<V>} - param configuration.
	 */
	public param<
		K extends string = string,
		V extends Params[K] | string | undefined = string,
		V1 = Params[K]
	>(
		value: K, 
		config?: ParamsConfig<V, V1> 
	): Path<
		(string extends keyof Params ? {} : Params) & { [key in K]: V }, 
		SubPaths
	> {
		const _this = this.clone<(string extends keyof Params ? {} : Params) & { [key in K]: V }, SubPaths>();

		_this.paths.push(
			Param.createParam(
				value as string,
				config as Params[K]
			)
		);

		return _this;
	}

	/**
	 * Children path's of current path.
	 * 
	 * @param subPaths {IPaths} - object containing the current path children path's
	 */
	public routes<IPaths extends Record<string, Path<any, any>> = Record<string, Path<any, any>>>(
		subPaths: IPaths
	): Path<Params, IPaths> {
		const _this = this.clone<Params, IPaths>();

		if ( __DEV__ ) {
			invariant(
				Object.entries(subPaths).find(([key, value]) => {
					return !(value.config.hash || value.config.hashModal)
				}),
				'Path\'s inside \'.routes({ ... })\' cannot be hash path\'s'
			);
		}

		_this.subPaths = subPaths;

		return _this;
	}

	protected getBasePath(basePath: string = '') {
		let newBasePath = basePath;

		if ( this.config.hash || this.config.hashModal ) {
			newBasePath = '#';
		}

		if ( this.config.isModal || this.config.hashModal ) {
			newBasePath += '/modal';
		}

		return newBasePath;
	}

	protected createPath(
		basePath?: string, 
		transforms?: Array<(params: StringifyObjectParams<Exclude<Params, undefined>>) => void>, 
		beforePaths?: Array<(params: Exclude<Params, undefined>) => void>
	): PathType<SubPaths, Params> {
		// Groups new transformations with transformations from parents
		const _transforms: Array<(params: StringifyObjectParams<Exclude<Params, undefined>>) => void> = transforms ? [...transforms] : [];
		// Groups new transformations with transformations from parents
		const _beforePaths: Array<(params: Exclude<Params, undefined>) => void> = beforePaths ? [...beforePaths] : [];

		// Creates path for current route
		const path = `${this.getBasePath(basePath)}/${this.paths
		.map((path) => {
			if ( typeof path === 'string' ) {
				return path;
			}
			if ( path.config?.transform ) {
				_transforms.push((params: StringifyObjectParams<Exclude<Params, undefined>>) => {
					(params as any)[path.key] = path.config!.transform!(params[path.key]);
				})
			}
			if ( path.config?.beforePath ) {
				_beforePaths.push((params: Exclude<Params, undefined>) => {
					(params as any)[path.key] = path.config!.beforePath!(params[path.key]);
				})
			}
			return path.param;
		})
		.join('/')}`

		// Generates subPaths
		const paths = Object.entries(this.subPaths ?? {})
		.reduce((obj, [key, value]) => {
			(obj as any)[key] = value.createPath(path === '/' ? '' : path, _transforms, _beforePaths);
			return obj;
		}, {} as PathsType<SubPaths>) 

		return {
			path,
			get: (params: Params) => {
				const _params: Exclude<Params, undefined> = (params ? {
					...params 
				} : {}) as Exclude<Params, undefined>;

				_beforePaths.forEach((beforePaths) => {
					beforePaths(_params);
				})

				let newPath = generatePath(
					path, 
					_params
				)

				if ( this._includeCurrentURL ) {
					newPath = createPathWithCurrentLocationHasHash(newPath);
				} 

				return newPath;
			},
			useParams: () => {
				return useParams<StringifyObjectParams<Exclude<Params, undefined>>>((params) => {
					_transforms.forEach((transform) => {
						transform(params);
					})

					return params;
				})
			},
			...paths
		} as any
	}
}

/**
 * Creates a new path
 * @param path {string} - path base/start
 */
export const path = (path?: string, config?: PathConfig) => {
	return new Path(config).addPath(path);
}
