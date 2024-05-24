import { type ViteRouteMetadata } from './type';

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

	description?: string | Record<string, string>

	keywords?: string[] | Record<string, string[]>
	/**
	 * To generic pages for dynamic pages
	 * @default en
	 */
	onDynamicRoutes?: (routeMetadata: ViteRouteMetadata) => Array<Partial<ViteRouteMetadata>> | undefined | Promise<Array<Partial<ViteRouteMetadata>> | undefined>
	title?: string | Record<string, string>

	/**
	 * Url for sitemap and twitter
	 * * Note: Without url sitemap will not be generated
	 */
	url?: string
};

type RequiredRouterConfig = Required<
	Pick<
		ViteReactRouterConfig, 
		'defaultLanguage' | 'defaultInitialRoute'
	>
>;

export type DefaultViteReactRouterConfig = RequiredRouterConfig
	& Omit<ViteReactRouterConfig, 'defaultLanguage'>;

const DEFAULT_CONFIG: DefaultViteReactRouterConfig = {
	defaultLanguage: 'en',
	defaultInitialRoute: '/'
};

export function getDefaultViteConfig(config?: ViteReactRouterConfig): DefaultViteReactRouterConfig {
	return {
		...DEFAULT_CONFIG,
		...config,
		defaultLanguage: config?.defaultLanguage ?? DEFAULT_CONFIG.defaultLanguage
	};
}
