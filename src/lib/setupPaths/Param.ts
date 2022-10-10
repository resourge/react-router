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

export type ParamsConfig<ParamResult = any, BeforePath = ParamResult> = { 
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
} | ParamsConfigOptional<ParamResult, BeforePath>

export class Param<Value = any> {
	public key: string = ''
	public param: string = ''
	public config?: ParamsConfig<Value>

	public static createParam<Value = any>(param: string, config?: ParamsConfig<Value>) {
		const instance = new this<Value>();

		instance.param = `:${param}`;
		instance.key = param;
		if ( config?.optional ) {
			instance.param = `{${instance.param}}?`;
		}
		instance.config = config;

		return instance;
	}
}
