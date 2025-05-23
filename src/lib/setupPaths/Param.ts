export type ParamsConfigOptional<UseValue = unknown, GetValue = UseValue> = {
	/**
     * Makes param optional
     */
	optional: true
	/**
     * Transforms param before path creation (get).
     */
	onGet?: (value: GetValue) => string
	/**
     * Transform's param on useParam.
     */
	onUseParams?: (value?: string) => UseValue | undefined
};

export type ParamsConfigNotOptional<UseValue = unknown, GetValue = UseValue> = {
	/**
     * Transforms param before path creation (get).
     */
	onGet?: (value: GetValue) => string
	/**
     * Transform's param on useParam.
     */
	onUseParams?: (value: string) => UseValue
	/**
     * Makes param optional
     */
	optional?: false | undefined
};

export type ParamsConfig<UseValue = unknown, GetValue = UseValue> = {
	options?: string[]
} & (ParamsConfigNotOptional<UseValue, GetValue> | ParamsConfigOptional<UseValue, GetValue>);

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
	Value,
	K extends string,
	const Config extends ParamsConfig<Value, any>
>(
	param: K, 
	config?: Config
): ParamPath<K, Config> => {
	if ( process.env.NODE_ENV === 'development' ) { 
		if ( param.includes(':') ) {
			throw new Error('Don\'t use \':\' inside `param`.');
		}
	}

	const instance = new ParamPath<K, Config>();

	instance.param = param;
	instance.key = param;
	instance.config = config as any;

	return instance;
};
