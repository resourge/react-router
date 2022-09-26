export type ParamsConfig<ParamResult = any> = { 
	/**
	 * Transforms param before path creation (get).
	 */
	beforePath?: (value: ParamResult) => string | ParamResult
	/**
	 * Makes param optional
	 */
	optional?: false | undefined 
	/**
	 * Transform's param on useParam.
	 */
	transform?: (value: string) => ParamResult 
} | { 
	/**
	 * Makes param optional
	 */
	optional: true
	/**
	 * Transforms param before path creation (get).
	 */
	beforePath?: (value: ParamResult) => string | ParamResult
	/**
	 * Transform's param on useParam.
	 */
	transform?: (value?: string) => ParamResult | undefined 
}

export class Param<Value = any> {
	public key: string = ''
	public param: string = ''
	public config?: ParamsConfig<Value>

	public static createParam<Value = any>(param: string, config?: ParamsConfig<Value>) {
		const instance = new this<Value>();

		instance.key = param;
		instance.param = `:${param}${config?.optional ? '?' : ''}`;
		instance.config = config;

		return instance;
	}
}
