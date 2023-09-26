export type Metadata<
	Langs extends string = string, 
	R extends string | Record<Langs, string> = string
> = {
	description?: R
	title?: R
}
