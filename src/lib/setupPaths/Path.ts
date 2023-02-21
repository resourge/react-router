/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/ban-types */
import { useParams } from '../hooks/useParams';
import { type StringifyObjectParams } from '../types/StringifyObjectParams';
import { type CleanObjects, type IsAllOptional } from '../types/types';
import { generatePath } from '../utils/generatePath';

import {
	Param,
	ParamPath,
	type ParamsConfig,
	type ParamsConfigOptional
} from './Param'

export function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, window.location.origin)

	const windowURL = new URL(window.location as any);
	newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : ''

	return newPath.href;
}

export type PathType<
	Routes extends Record<string, Path<any, any, any>>, 
	Params extends Record<string, any> | undefined = undefined, 
	UseParams extends Record<string, any> | undefined = undefined
> = {
	/**
	 * Method to obtain the true path.
	 * Calling it with `params` will replace the params with the params value on the path.
	 */
	get: Params extends undefined 
		? (() => string)
		: IsAllOptional<Params> extends true 
			? (
				((params?: Params) => string)
			) : (params: Params) => string
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: string
} & InjectParamsIntoPathType<Routes, Params, UseParams> & (
	IsAllOptional<UseParams> extends false ? {
		/**
		 * Hook to receive the params related to the route.
		 * Here all the transform method will transform the params to the desired params. 
		 */
		useParams: () => UseParams
	} : (
		undefined extends UseParams ? {} : {
		/**
		 * Hook to receive the params related to the route.
		 * Here all the transform method will transform the params to the desired params. 
		 */
			useParams: () => UseParams
		}
	)
)

export type InjectParamsIntoPathType<
	Paths extends Record<string, Path<any, any, any>>, 
	Params extends Record<string, any> | undefined = undefined, 
	UseParams extends Record<string, any> | undefined = undefined
> = {
	[K in keyof Paths]: PathType<
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_routes'], 
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_params'] & Params,
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_useParams'] & UseParams
	>
}

export type InjectParamsIntoPath<
	Params extends Record<string, any>, 
	UseParams extends Record<string, any>, 
	Paths extends Record<string, Path<any, any, any>>
> = string extends keyof Params ? Paths : {
	[K in keyof Paths]: Path<
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_params'] & Params, 
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_useParams'] & UseParams, 
		InjectParamsIntoPath<
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_params'] & Params, 
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_useParams'] & UseParams, 
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_routes']
		>
	>
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
	Params extends Record<string, any>, 
	UseParams extends Record<string, any>, 
	Routes extends Record<string, Path<any, any, any>>
> {
	protected _params!: Params;
	protected _useParams!: UseParams;
	protected _routes!: Routes;

	protected config: PathConfig = {}
	protected paths: Array<ParamPath<keyof Params, Params[keyof Params]> | string> = [];
	private _includeCurrentURL?: boolean;

	constructor(config?: PathConfig) {
		this.config = config ?? {};
	}

	protected clone<
		Params extends Record<string, any> = Record<string, any>, 
		UseParams extends Record<string, any> = Record<string, any>, 
		Routes extends Record<string, Path<any, any, any>> = Record<string, Path<any, any, any>>
	>() { 
		const _this = new Path<Params, UseParams, Routes>();

		_this.paths = [...this.paths] as unknown as Array<ParamPath<Params[keyof Params]> | string>;
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
		const _this = this.clone<Params, UseParams, Routes>();
		_this._includeCurrentURL = includeCurrentURL;
		return _this;
	}

	/**
	 * Add's new value to the path. (Add's the value into the path in the calling other).
	 * @param path {string} - new path part
	 */
	public addPath(path?: string) {
		const _this = this.clone<Params, UseParams, Routes>();
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
		ParamsValue extends Params[K] | string | undefined = string
	>(
		value: K
	): Path<
		CleanObjects<Params, { [key in K]: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]: ParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]: ParamsValue }>, 
			Routes
		>
	>
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfigOptional<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string, 
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue
	>(
		value: K, 
		config: ParamsConfigOptional<UseParamsValue extends ParamsValue ? ParamsValue : UseParamsValue, ParamsValue> 
	): Path<
		CleanObjects<Params, { [key in K]?: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]?: UseParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]?: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]?: UseParamsValue }>, 
			Routes
		>
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue
	>(
		value: K, 
		config: ParamsConfig<UseParamsValue extends ParamsValue ? ParamsValue : UseParamsValue, ParamsValue> 
	): Path<
		CleanObjects<Params, { [key in K]: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
			Routes
		>
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {ParamPath} - Param
	 */
	public param<
		K extends string = string,
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue,
		IsOptional = false
	>(
		value: ParamPath<K, ParamsValue, UseParamsValue, IsOptional>
	): Path<
		CleanObjects<Params, (IsOptional extends false ? { [key in K]?: ParamsValue } : { [key in K]: ParamsValue })>, 
		CleanObjects<UseParams, (IsOptional extends false ? { [key in K]?: UseParamsValue } : { [key in K]: UseParamsValue })>, 
		InjectParamsIntoPath<
			CleanObjects<Params, (IsOptional extends false ? { [key in K]?: ParamsValue } : { [key in K]: ParamsValue })>, 
			CleanObjects<UseParams, (IsOptional extends false ? { [key in K]?: UseParamsValue } : { [key in K]: UseParamsValue })>, 
			Routes
		>
	>;

	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue
	>(
		value: K | ParamPath<K, ParamsValue>, 
		config?: ParamsConfig<UseParamsValue extends ParamsValue ? ParamsValue : UseParamsValue, ParamsValue> 
	): Path<
		CleanObjects<Params, { [key in K]: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
			Routes
		>
	> {
		const _this = this.clone<(string extends keyof Params ? {} : Params) & { [key in K]: ParamsValue }, Routes>();

		if ( value instanceof ParamPath ) {
			_this.paths.push(
				value as any
			);
			return _this as any;
		}

		_this.paths.push(
			Param<K, UseParamsValue, any>(
				value,
				config as any
			) as any
		);

		return _this as any;
	}

	/**
	 * Children path's of current path.
	 * 
	 * @param routes {Record<string, Path<any, any, any>>} - object containing the current path children path's
	 */
	public routes<S extends Record<string, Path<any, any, any>>>(
		routes: S
	): Path<Params, UseParams, S> {
		const _this = this.clone<Params, UseParams, S>();

		/* if ( __DEV__ ) {
			invariant(
				Object.entries(routes).find(([key, value]) => {
					return !(value.config.hash || value.config.hashModal)
				}),
				'Path\'s inside \'.routes({ ... })\' cannot be hash path\'s'
			);
		} */

		_this._routes = routes;

		return _this;
	}

	protected getBasePath(basePath: string = '') {
		let newBasePath = '';

		if ( this.config.hash || this.config.hashModal ) {
			newBasePath = '#';
		}

		if ( this.config.isModal || this.config.hashModal ) {
			newBasePath += '/modal';
		}

		newBasePath += basePath;

		return newBasePath;
	}

	protected createPath(
		basePath?: string, 
		transforms?: Array<(params: StringifyObjectParams<Exclude<Params, undefined>>) => void>, 
		beforePaths?: Array<(params: Exclude<Params, undefined>) => void>
	): PathType<Routes, Params, UseParams> {
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
	UseParams extends Record<string, any>,
	Paths extends Record<string, Path<Params, UseParams, any>> = Record<string, Path<Params, UseParams, any>>
>(path?: string, config?: PathConfig): Path<Params, UseParams, Paths> => {
	return new Path(config).addPath(path) as Path<Params, UseParams, Paths>;
}
