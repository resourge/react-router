/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import invariant from 'tiny-invariant';

import { type StringifyObjectParams, useParams } from 'src/lib/hooks/useParams';
import { generatePath } from 'src/lib/utils/generatePath';

import { Param, type ParamsConfig, type ParamsConfigOptional } from './Param';

export function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, window.location.origin)

	const windowURL = new URL(window.location as any);
	newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : ''

	return newPath.href;
}

export type PathType<
	Routes extends Record<string, Path<any, any>>, 
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
} & InjectParamsIntoPathType<Routes, Params> & (
	string extends keyof Params ? {} : {
		/**
		 * Hook to receive the params related to the route.
		 * Here all the transform method will transform the params to the desired params. 
		 */
		useParams: () => Params
	}
)

export type InjectParamsIntoPathType<
	Paths extends Record<string, Path<any, any>>, 
	Params extends Record<string, any> | undefined = undefined
> = {
	[K in keyof Paths]: PathType<
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_routes'], 
		string extends keyof Params 
			// @ts-expect-error Want to protect value, but also access it with types
			? Paths[K]['_params'] 
			: (
				// @ts-expect-error Want to protect value, but also access it with types
				string extends keyof Paths[K]['_params']
					? Params
					// @ts-expect-error Want to protect value, but also access it with types
					: Paths[K]['_params'] & Params
			)
	>
}

export type InjectParamsIntoPath<
	Params extends Record<string, any>, 
	Paths extends Record<string, Path<any, any>>
> = string extends keyof Params ? Paths : {
	[K in keyof Paths]: Path<
		string extends keyof Params 
			// @ts-expect-error Want to protect value, but also access it with types
			? Paths[K]['_params'] 
			// @ts-expect-error Want to protect value, but also access it with types
			: Paths[K]['_params'] & Params, 
		InjectParamsIntoPath<
			string extends keyof Params 
				// @ts-expect-error Want to protect value, but also access it with types
				? Paths[K]['_params'] 
				// @ts-expect-error Want to protect value, but also access it with types
				: Paths[K]['_params'] & Params, 
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_routes']
		>
	>
}
// Paths[K]['_params'] & Params

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
	Params extends Record<string, any>, 
	Routes extends Record<string, Path<any, any>>
> {
	protected _params!: Params;
	protected _routes!: Routes;

	protected config: PathConfig = {}
	protected paths: Array<Param<Params[keyof Params]> | string> = [];
	private _includeCurrentURL?: boolean;

	constructor(config?: PathConfig) {
		this.config = config ?? {};
	}

	protected clone<
		Params extends Record<string, any> = Record<string, any>, 
		Routes extends Record<string, Path<any, any>> = Record<string, Path<any, any>>
	>() { 
		const _this = new Path<Params, Routes>();

		_this.paths = [...this.paths] as unknown as Array<Param<Params[keyof Params]> | string>;
		_this._routes = {
			...this._routes
		} as unknown as Routes;
		_this._includeCurrentURL = this._includeCurrentURL;
		_this.config = this.config;

		return _this;
	}

	/**
	 * Makes method `get` to return the current path as hash.
	 * @param includeCurrentURL {boolean}
	 */
	public includeCurrentURL(includeCurrentURL?: boolean) {
		const _this = this.clone<Params, Routes>();
		_this._includeCurrentURL = includeCurrentURL;
		return _this;
	}

	/**
	 * Add's new value to the path. (Add's the value into the path in the calling other).
	 * @param path {string} - new path part
	 */
	public addPath(path?: string) {
		const _this = this.clone<Params, Routes>();
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
		InjectParamsIntoPath<
			(string extends keyof Params ? {} : Params) & { [key in K]: V }, 
			Routes
		>
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
		InjectParamsIntoPath<
			(string extends keyof Params ? {} : Params) & { [key in K]?: V }, 
			Routes
		>
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
		InjectParamsIntoPath<
			(string extends keyof Params ? {} : Params) & { [key in K]: V }, 
			Routes
		>
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
		InjectParamsIntoPath<
			(string extends keyof Params ? {} : Params) & { [key in K]: V }, 
			Routes
		>
	> {
		if ( __DEV__ ) { 
			invariant(
				!value.includes(':'),
				'Don\'t use \':\' inside `param`.'
			);
		}
		const _this = this.clone<(string extends keyof Params ? {} : Params) & { [key in K]: V }, Routes>();

		_this.paths.push(
			Param.createParam(
				value as string,
				config as Params[K]
			)
		);

		return _this as any;
	}

	/**
	 * Children path's of current path.
	 * 
	 * @param routes {Record<string, Path<any, any>>} - object containing the current path children path's
	 */
	public routes<S extends Record<string, Path<any, any>>>(
		routes: S
	): Path<Params, S> {
		const _this = this.clone<Params, S>();

		if ( __DEV__ ) {
			invariant(
				Object.entries(routes).find(([key, value]) => {
					return !(value.config.hash || value.config.hashModal)
				}),
				'Path\'s inside \'.routes({ ... })\' cannot be hash path\'s'
			);
		}

		_this._routes = routes;

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
	): PathType<Routes, Params> {
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

		// Generates routes
		const paths = Object.entries(this._routes ?? {})
		.reduce((obj, [key, value]) => {
			obj[key] = value.createPath(path === '/' ? '' : path, _transforms, _beforePaths);
			return obj;
			// Too hard to put a working type that doesn't create a problem in return
		}, {} as any) 

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
		}
	}
}

/**
 * Creates a new path
 * @param path {string} - path base/start
 */
export const path = <
	Params extends Record<string, any>,
	Paths extends Record<string, Path<Params, any>> = Record<string, Path<Params, any>>
>(path?: string, config?: PathConfig): Path<Params, Paths> => {
	return new Path(config).addPath(path) as Path<Params, Paths>;
}
