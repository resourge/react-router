export type VitePathRouteMetadata = { 
	description: Record<string, string> | string
	isPrivate?: boolean
	keywords: Record<string, string[]> | string[]
	route: string
	title: Record<string, string> | string
};

export type ViteRouteMetadata = { 
	description: Record<string, string>
	/**
	 * Privates pages will not generate html and they will be excluded from sitemap.xml
	 * @default false
	 */
	isPrivate?: boolean
	keywords: Record<string, string[]>
	route: string
	title: Record<string, string>
};
