import invariant from 'tiny-invariant';

export type ParamsConfigOptional = { 
	/**
	 * Makes param optional
	 */
	optional: true
	/**
	 * Transforms param before path creation (get).
	 */
	onGet?: (value: any) => string
	/**
	 * Transform's param on useParam.
	 */
	onUseParams?: (value?: string) => unknown | undefined 
};

export type ParamsConfigNotOptional = { 
	/**
	 * Transforms param before path creation (get).
	 */
	onGet?: (value: any) => string
	/**
	 * Transform's param on useParam.
	 */
	onUseParams?: (value: string) => unknown 
	/**
	 * Makes param optional
	 */
	optional?: false | undefined 
};

export type ParamsConfig = {
	options?: string[]
} & (ParamsConfigNotOptional | ParamsConfigOptional);

export class ParamPath<Key, Config extends ParamsConfig = ParamsConfig> {
	public key: Key = '' as Key;
	public param: string = '';
	public config?: Config;

	public parseParam(hasNextPath: boolean) {
		const doesNotHaveTheSlash = hasNextPath && this.config?.optional;
		let param = `${(doesNotHaveTheSlash) ? '' : '/'}:${this.param}${this.config?.options && this.config?.options.length ? `(${this.config.options.join('|')})` : ''}`;
		if ( this.config?.optional ) {
			param = `${doesNotHaveTheSlash ? '/' : ''}{${param}}?`;
		}

		return param;
	}
}

export const Param = < 
	K extends string,
	const Config extends ParamsConfig
>(
	param: K, 
	config?: Config
): ParamPath<K, Config> => {
	if ( __DEV__ ) { 
		invariant(
			!param.includes(':'),
			'Don\'t use \':\' inside `param`.'
		);
	}

	const instance = new ParamPath<K, Config>();

	instance.param = param;
	instance.key = param;
	instance.config = config as any;

	return instance;
};
