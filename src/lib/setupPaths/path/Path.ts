/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useParams } from '../../hooks/useParams';
import { useSearchParams } from '../../hooks/useSearchParams/useSearchParams';
import {
	type IfIncludesParam,
	type IsHashPath,
	type ParamString,
	type ResolveSlash
} from '../../types/StringTypes';
import { type StringifyObjectParams } from '../../types/StringifyObjectParams';
import {
	type PickValue,
	type GetValueFromBeforePath,
	type GetValueFromTransform,
	type IsAllOptional,
	type IsOptional,
	type MakeObjectOptional,
	type MakeUndefinedOptional,
	type MergeObj,
	type MergeParamsAndCreate
} from '../../types/types';
import { FIT_IN_ALL_ROUTES, getFitInAllRoutesReg } from '../../utils/constants';
import { generatePath } from '../../utils/generatePath';
import { resolveSlash } from '../../utils/resolveSlash';
import { createPathWithCurrentLocationHasHash, getParams, getSearchParams } from '../../utils/utils';
import { WINDOWS } from '../../utils/window/window';
import { Param, ParamPath, type ParamsConfig } from '../Param';
import { type SearchParamsPathType, type SearchParamsType } from '../SearchParam';

export type InjectParamsIntoPathType<
	BaseKey extends string,
	Routes extends Record<string, Path<any, string>>,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>
> = {
	[K in keyof Routes]: PathType<
		ResolveSlash<[IsHashPath<PickValue<Routes[K], '_key'>> extends true ? '' : BaseKey, PickValue<Routes[K], '_key'>]>,
		IsHashPath<PickValue<Routes[K], '_key'>> extends true 
			? PickValue<Routes[K], '_params'> 
			: MergeObj<Params, PickValue<Routes[K], '_params'>>,
		IsHashPath<PickValue<Routes[K], '_key'>> extends true 
			? PickValue<Routes[K], '_paramsResult'> 
			: MergeObj<ParamsResult, PickValue<Routes[K], '_paramsResult'>>,
		PickValue<Routes[K], '_searchParams'>,
		PickValue<Routes[K], '_routes'>
	>
};

export type AddConfigParamsIntoRoutes<
	Routes extends Record<string, Path<any, string>>,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>
> = {
	[K in keyof Routes]: Path<
		AddConfigParamsIntoRoutes<
			PickValue<Routes[K], '_routes'>,
			IsHashPath<PickValue<Routes[K], '_key'>> extends true 
				? PickValue<Routes[K], '_params'>
				: MergeObj<Params, PickValue<Routes[K], '_params'>>,
			IsHashPath<PickValue<Routes[K], '_key'>> extends true 
				? PickValue<Routes[K], '_paramsResult'>
				: MergeObj<ParamsResult, PickValue<Routes[K], '_paramsResult'>>
		>,
		PickValue<Routes[K], '_key'>,
		PickValue<Routes[K], '_params'>,
		PickValue<Routes[K], '_paramsResult'>,
		PickValue<Routes[K], '_searchParams'>
	>
};

export type PathType<
	Key extends string,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>,
	SearchParams extends SearchParamsType | undefined,
	Routes extends Record<string, Path<any, string>>,
	All = IfIncludesParam<Key>
> = {
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: Key
} 
& InjectParamsIntoPathType<Key, Routes, Params, ParamsResult>
& (
	IsOptional<SearchParams> extends true
		? {} 
		: {
			searchParams: string[]
			useSearchParams: () => SearchParams
		}
)
& (
	All extends false
		? (
			{
				/**
				 * Method to obtain the true path.
				 * Calling it with `params` will replace the params with the params value on the path.
				 */
				get: (params?: SearchParamsPathType<SearchParams>) => Key
			} 
		)
		: {
			/**
			 * Method to obtain the true path.
			 * Calling it with `params` will replace the params with the params value on the path.
			 */
			get: IsAllOptional<Params> extends true 
				? (params?: Params & SearchParamsPathType<SearchParams>) => Key
				: (params: Params & SearchParamsPathType<SearchParams>) => Key
			/**
			 * Hook to receive the params related to the route.
			 * Here all the transform method will transform the params to the desired params. 
			 */
			useParams: () => ParamsResult
		}
);

/**
 * @important This config is not used in children paths
 */
type PathConfig = {
	/**
	 * Makes so path works in all routes
	 */
	fitInAllRoutes?: boolean
	/**
	 * Turns path into a hash path
	 */
	hash?: boolean
};

export class Path<
	Routes extends Record<string, Path<any, string>>, 
	Key extends string,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends SearchParamsType = SearchParamsType
> {
	protected _routes!: Routes;
	protected _key!: Key;
	protected _params!: Params;
	protected _paramsResult!: ParamsResult;
	protected _searchParams!: SearchParams;

	protected config: PathConfig = {};
	protected paths: Array<ParamPath<string> | string> = [];
	protected searchParamsList: string[] = [];
	private _includeCurrentURL?: boolean | ((currentURL: URL) => string | undefined);

	constructor(path?: string, config?: PathConfig) {
		this.config = config ?? {};

		let _path: string | undefined = path;
		if ( config?.fitInAllRoutes ) {
			_path = `${FIT_IN_ALL_ROUTES}${path ?? ''}`;
		}
		else if ( path ) {
			_path = `/${path}`;
		}

		if ( _path ) {
			this.paths.push(_path);
		}
	}

	protected clone() { 
		const _this = new Path<Routes, Key, Params, ParamsResult, SearchParams>();

		_this.paths = [...this.paths] as unknown as Array<ParamPath<string> | string>;
		_this._routes = {
			...this._routes
		} as unknown as Routes;
		_this._includeCurrentURL = this._includeCurrentURL;
		_this.config = this.config;

		return _this;
	}

	/**
	 * Makes method `get` to return the current path as hash.
	 * @param includeCurrentURL {boolean | ((currentURL: URL) => string | undefined)} @default true
	 */
	public includeCurrentURL(includeCurrentURL: boolean | ((currentURL: URL) => string | undefined) = true) {
		const _this = this.clone();
		_this._includeCurrentURL = includeCurrentURL;
		return _this;
	}

	/**
	 * Add's new value to the path. (Add's the value into the path in the calling other).
	 * @param path {string} - new path part
	 */
	public addPath(path?: string) {
		const _this = this.clone();
		if ( path ) {
			_this.paths.push(`/${path}`);
		}
		return _this;
	}

	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		K extends string
	>(
		value: K
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>,
		MergeParamsAndCreate<Params, K, false, string>,
		MergeParamsAndCreate<ParamsResult, K, false, string>, 
		SearchParams
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		UseValue,
		K extends string
	>(
		value: K
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>,
		MergeParamsAndCreate<Params, K, false, UseValue>,
		MergeParamsAndCreate<ParamsResult, K, false, UseValue>, 
		SearchParams
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		UseValue,
		GetValue,
		K extends string
	>(
		value: K
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>,
		MergeParamsAndCreate<Params, K, false, GetValue>,
		MergeParamsAndCreate<ParamsResult, K, false, UseValue>, 
		SearchParams
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		K extends string = string,
		Config extends ParamsConfig<any, any> = ParamsConfig<any, any>
	>(
		value: ParamPath<K, Config>
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>, 
		MergeParamsAndCreate<Params, K, Config['optional'], GetValueFromBeforePath<Config>>,
		MergeParamsAndCreate<ParamsResult, K, undefined extends ReturnType<NonNullable<Config['onUseParams']>> ? Config['optional'] : false, GetValueFromTransform<Config>>,
		SearchParams
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		Config extends ParamsConfig<any, any> = ParamsConfig<any, any>
	>(
		value: K, 
		config: Config
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<Config['optional'] extends true ? `${K}?` : K>]>,
		MergeParamsAndCreate<Params, K, Config['optional'], GetValueFromBeforePath<Config>>,
		MergeParamsAndCreate<
			ParamsResult, 
			K, 
			undefined extends ReturnType<NonNullable<Config['onUseParams']>> ? Config['optional'] : false, 
			GetValueFromTransform<Config>
		>,
		SearchParams
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		Value = unknown,
		K extends string = string,
		Config extends ParamsConfig<Value, any> = ParamsConfig<Value, any>
	>(
		value: K | ParamPath<K, Config>, 
		config?: Config
	): Path<
			Routes,
			ResolveSlash<[Key, ParamString<K>]>,
			MergeParamsAndCreate<Params, K, Config['optional'], GetValueFromBeforePath<Config>>,
			MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>,
			SearchParams
		> {
		const _this = this.clone();

		_this.paths.push(
			value instanceof ParamPath
				? value
				: Param<Value, K, Config>(
					value,
					config
				)
		);

		return _this as any;
	}
	
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public searchParams<
		SP extends SearchParamsType
	>(
		searchParams: SP
	): Path<
			Routes,
			Key,
			Params,
			ParamsResult,
			MakeObjectOptional<MakeUndefinedOptional<SP>>
		> {
		const _this = this.clone();

		_this.searchParamsList = this.extractSearchParams(searchParams);

		return _this as any;
	}

	private extractSearchParams<SP extends SearchParamsType>(searchParams: SP, baseKey: string = '', index: number = -1): string[] {
		return Object.keys(searchParams)
		.flatMap<string>((key) => {
			const value = searchParams[key];
			if ( typeof value === 'object' && !('optional' in value) ) {
				return this.extractSearchParams(value as SP, key);
			}

			return value && value.optional ? [] : [`${baseKey ? `${baseKey}${index === -1 ? '.' : `[${index}]`}` : ''}${key}`];
		});
	}

	/**
	 * Children path's of current path.
	 * 
	 * @param routes {Record<string, Path<any, any, any>>} - object containing the current path children path's
	 */
	public routes<
		S extends Record<string, Path<any, string>>
	>(
		routes: S
	): Path<
			S, 
			Key, 
			Params,
			ParamsResult,
			SearchParams
		> {
		const _this = this.clone() as unknown as Path<S, Key, Params, ParamsResult, SearchParams>;

		if ( process.env.NODE_ENV === 'development' ) {
			if ( this.config?.fitInAllRoutes) {
				function checkFitInAllRoute(routes: Record<string, Path<any, string>>): boolean {
					return Object.values(routes)
					.some((value) => (
						value.config.fitInAllRoutes
						|| (
							value._routes
							// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
							&& checkFitInAllRoute(value._routes)
						)
					));
				}

				if ( checkFitInAllRoute(routes) ) {
					throw new Error('Path\'s inside a fitInAllRoutes Path cannot have another fitInAllRoutes\'s');
				}
			}
		}

		_this._routes = routes;

		return _this;
	}

	protected createPath(
		previousPaths: Array<string | ParamPath<string, ParamsConfig>> = []
	): any {
		// Groups new transformations with transformations from parents
		const transforms: Array<(params: StringifyObjectParams<Record<string, any>>) => void> = [];
		// Groups new transformations with transformations from parents
		const beforePaths: Array<(params: Record<string, any>) => void> = [];

		const newPaths = [
			...(this.config.hash ? ['#'] : previousPaths), 
			...this.paths
		];

		// Creates path for current route
		const path = (
			newPaths
			.map((path) => (
				// Multiple same params will always take the config from the last param
				// This is so we can override the first param with last
				newPaths
				.findLast((arrPath) => (
					typeof arrPath === 'object' && typeof path === 'object'
					&& arrPath.param === path.param
				)) ?? path
			))
			.filter((path, index, arr) => 
				typeof path === 'string'
				|| arr.findIndex((arrPath) => (
					typeof arrPath === 'object' && typeof path === 'object'
					&& arrPath.param === path.param
				)) === index
			)
			.map((path, index, arr) => {
				if ( typeof path === 'string' ) {
					return path;
				}

				if (path.config?.onUseParams) {
					transforms.push((params) => {
						(params as any)[path.key] = path.config!.onUseParams!(params[path.key]);
					});
				}

				if (path.config?.onGet) {
					beforePaths.push((params) => {
						(params as any)[path.key] = path.config!.onGet!(params[path.key]);
					});
				}
	
				return path.parseParam(index !== arr.length - 1);
			})
			.join('')
		) || '/';

		// Generates routes
		const paths = Object.entries(this._routes ?? {})
		.reduce<Record<string, any>>((obj, [key, value]) => {
			obj[key] = value.createPath(newPaths);
			return obj;
		}, {}); 

		const _includeCurrentURL = this._includeCurrentURL;

		return {
			path,
			searchParams: this.searchParamsList,
			get(params: Params) {
				const _params = getParams(params, beforePaths);

				let newPath = generatePath(
					path, 
					_params
				);

				if ( newPath.includes(FIT_IN_ALL_ROUTES) ) {
					const url = new URL(WINDOWS.location.href);

					url.pathname = resolveSlash(url.pathname, newPath.replace(getFitInAllRoutesReg(), ''));

					newPath = url.href.replace(url.origin, '');
				}

				newPath = `${newPath}${getSearchParams(params)}`;

				if ( _includeCurrentURL ) {
					newPath = createPathWithCurrentLocationHasHash(
						newPath, 
						typeof _includeCurrentURL === 'function' 
							? _includeCurrentURL(WINDOWS.location)
							: undefined
					);
				}

				return newPath;
			},
			useParams() {
				return useParams<StringifyObjectParams<Exclude<Params, undefined>>>((params) => {
					transforms.forEach((onUseParams) => {
						onUseParams(params);
					});

					return params;
				});
			},
			useSearchParams<T extends Record<string, any>>(defaultParams?: T) {
				return useSearchParams<T>(defaultParams);
			},
			...paths
		};
	}
}

/**
 * Creates a new path
 * @param path {string} - path base/start
 */
export function path<
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends SearchParamsType = SearchParamsType
>(): Path<Routes, '', Params, ParamsResult, SearchParams>; 
export function path<
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends SearchParamsType = SearchParamsType,
	Key extends string = string
>(path: Key): Path<Routes, Key, Params, ParamsResult, SearchParams>; 
export function path<
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends SearchParamsType = SearchParamsType,
	Key extends string = string
>(path: Key, config: PathConfig & {
	hash: true
}): Path<Routes, ResolveSlash<['#', Key]>, Params, ParamsResult, SearchParams>; 
export function path<
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends SearchParamsType = SearchParamsType,
	Key extends string = string
>(path: Key, config: PathConfig): Path<Routes, Key, Params, ParamsResult, SearchParams>; 
export function path<
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends SearchParamsType = SearchParamsType,
	Key extends string = string
>(path?: Key, config?: PathConfig): Path<Routes, Key, Params, ParamsResult, SearchParams> {
	return new Path(path, config);
}
