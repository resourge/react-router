import { type ViteRouteMetadata } from './type';

type RequiredRouterConfig = Required<
	Pick<
		ViteReactRouterConfig, 
		'defaultInitialRoute' | 'defaultLanguage'
	>
>;

export type DefaultViteReactRouterConfig = Omit<ViteReactRouterConfig, 'defaultLanguage'>
	& RequiredRouterConfig;

export type ViteReactRouterConfig = {
	/**
	 * Origin url for site
	 * @default /
	 */
	defaultInitialRoute?: string
	/**
	 * For the files without translations
	 * @default en
	 */
	defaultLanguage?: string

	description?: Record<string, string> | string

	keywords?: Record<string, string[]> | string[]
	/**
	 * To generic pages for dynamic pages
	 * @default en
	 */
	onDynamicRoutes?: (routeMetadata: ViteRouteMetadata) => Array<Partial<ViteRouteMetadata>> | Promise<Array<Partial<ViteRouteMetadata>> | undefined> | undefined
	title?: Record<string, string> | string

	/**
	 * Url for sitemap and twitter
	 * * Note: Without url sitemap will not be generated
	 */
	url?: string
};

const DEFAULT_CONFIG: DefaultViteReactRouterConfig = {
	defaultInitialRoute: '/',
	defaultLanguage: 'en'
};

export function getDefaultViteConfig(config?: ViteReactRouterConfig): DefaultViteReactRouterConfig {
	return {
		...DEFAULT_CONFIG,
		...config,
		defaultLanguage: config?.defaultLanguage ?? DEFAULT_CONFIG.defaultLanguage
	};
}
