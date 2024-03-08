export type InMemoryCode = Record<string, string>;

export type VitePathRouteMetadata = { 
	description: string | Record<string, string>
	keywords: string[] | Record<string, string[]>
	route: string
	title: string | Record<string, string>
	isPrivate?: boolean
}

export type ViteRouteMetadata = { 
	description: Record<string, string>
	keywords: Record<string, string[]>
	route: string
	title: Record<string, string>
	/**
	 * Privates pages will not generate html and they will be excluded from sitemap.xml
	 * @default false
	 */
	isPrivate?: boolean
}
