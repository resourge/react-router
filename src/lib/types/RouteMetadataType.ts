export type RouteMetadataType = {
	route: string
	description?: string | Record<string, string>
	/**
	 * Privates pages will not generate html and they will be excluded from sitemap.xml
	 * @default false
	 */
	isPrivate?: boolean
	keywords?: string[] | Record<string, string[]>
	title?: string | Record<string, string>
};
