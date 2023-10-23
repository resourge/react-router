export type RouteMetadataType<
	Langs extends string = string, 
	R extends string | Record<Langs, string> = string,
	Keywords extends string[] | Record<Langs, string[]> = string[]
> = {
	route: string
	description?: R
	keywords?: Keywords
	title?: R
}

export function setRouteMetadata<
	Langs extends string = string, 
	R extends string | Record<Langs, string> = string
>(routeMetadata: RouteMetadataType<Langs, R>) {
	return routeMetadata;
}
