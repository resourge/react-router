
export type StringifyObjectParams<T extends Record<string, any>> = {
	[Key in keyof T]: string
}
