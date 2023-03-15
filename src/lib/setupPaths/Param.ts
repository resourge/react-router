import invariant from 'tiny-invariant'

export type ParamsConfigOptional<ParamResult = any, BeforePath = ParamResult> = { 
	/**
	 * Makes param optional
	 */
	optional: true
	/**
	 * Transforms param before path creation (get).
	 */
	beforePath?: (value: BeforePath) => string | BeforePath
	/**
	 * Transform's param on useParam.
	 */
	transform?: (value?: string) => ParamResult | undefined 
}

export type ParamsConfigNotOptional<ParamResult = any, BeforePath = ParamResult> = { 
	/**
	 * Transforms param before path creation (get).
	 */
	beforePath?: (value: BeforePath) => string | BeforePath
	/**
	 * Makes param optional
	 */
	optional?: false | undefined 
	/**
	 * Transform's param on useParam.
	 */
	transform?: (value: string) => ParamResult 
}

export type ParamsConfig<ParamResult = any, BeforePath = ParamResult> = ParamsConfigNotOptional<ParamResult, BeforePath> | ParamsConfigOptional<ParamResult, BeforePath>

export class ParamPath<Key = any, Params = any, UseParams = Params, IsOptional = false> {
	public key: Key = '' as Key
	public param: string = ''
	public config?: IsOptional extends true 
		? ParamsConfigOptional<UseParams, Params> 
		: ParamsConfigNotOptional<UseParams, Params>
}

export const Param = < 
	K extends string = string,
	Params extends any | undefined = string,
	UseParams = Params,
	IsOptional extends boolean = false
>(
	param: K, 
	config?: ParamsConfig<UseParams extends Params ? Params : UseParams, Params> & {
		optional?: IsOptional
	}
): ParamPath<K, Params, UseParams, IsOptional extends true ? false : true> => {
	if ( __DEV__ ) { 
		invariant(
			!param.includes(':'),
			'Don\'t use \':\' inside `param`.'
		);
	}

	const instance = new ParamPath<K, Params, UseParams, IsOptional extends true ? false : true>();

	instance.param = `/:${param}([^/]*)`;
	instance.key = param;
	if ( config?.optional ) {
		instance.param = `{${instance.param}}?`;
	}
	instance.config = config as any

	return instance;
}
