export type InMemoryCode = Record<string, string>;

export type ViteReactRouterPathsType = { 
	description: string | Record<string, string>
	keywords: string[] | Record<string, string[]>
	route: string
	title: string | Record<string, string>
}

export type ViteReactRouterConfig = {
	url: string
	description?: string | Record<string, string>
	keywords?: string[] | Record<string, string[]>
	title?: string | Record<string, string>
}
