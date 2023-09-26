import invariant from 'tiny-invariant'

import { type AsConst } from '../types/AsConst'

export type ParamsConfigOptional = { 
	/**
	 * Makes param optional
	 */
	optional: true
	/**
	 * Transforms param before path creation (get).
	 */
	beforePath?: (value: any) => string
	/**
	 * Transform's param on useParam.
	 */
	transform?: (value?: string) => unknown | undefined 
}

export type ParamsConfigNotOptional = { 
	/**
	 * Transforms param before path creation (get).
	 */
	beforePath?: (value: any) => string
	/**
	 * Makes param optional
	 */
	optional?: false | undefined 
	/**
	 * Transform's param on useParam.
	 */
	transform?: (value: string) => unknown 
}

export type ParamsConfig = {
	options?: string[]
} & (ParamsConfigNotOptional | ParamsConfigOptional)

export class ParamPath<Key, Config extends ParamsConfig = ParamsConfig> {
	public key: Key = '' as Key
	public param: string = ''
	public config?: Config
}

export const Param = < 
	K extends string,
	Config extends ParamsConfig
>(
	param: K, 
	config?: AsConst<Config>
): ParamPath<K, Config> => {
	if ( __DEV__ ) { 
		invariant(
			!param.includes(':'),
			'Don\'t use \':\' inside `param`.'
		);
	}

	const instance = new ParamPath<K, Config>();

	instance.param = `/:${param}${config?.options && config?.options.length ? `(${config.options.join('|')})` : ''}`;
	instance.key = param;
	if ( config?.optional ) {
		instance.param = `{${instance.param}}?`;
	}
	instance.config = config as any

	return instance;
}
