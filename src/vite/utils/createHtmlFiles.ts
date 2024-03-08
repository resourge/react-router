import { minify as minifyFn } from 'html-minifier-terser';
import { parse } from 'node-html-parser';
import { type ResolvedConfig } from 'vite';

import { createFile } from './createFile';
import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import {
	findOrCreateMeta,
	findOrCreateMetaItemProp,
	findOrCreateMetaProperty,
	getOptions
} from './utils';

export type FilesType = { 
	fileName: string
	url: string
	description?: string
	keywords?: string[]
	title?: string
	translation?: string
}

export type CreateHtmlFilesConfig = {
	config: DefaultViteReactRouterConfig
	html: string
	maxFileNameLength: number
	pages: FilesType[]
	rootConfig: ResolvedConfig
}

export function createHtmlFiles({
	pages, 
	html, 
	rootConfig,
	config,
	maxFileNameLength
}: CreateHtmlFilesConfig) {
	const root = parse(html);

	return Promise.all(
		pages
		.map(
			async ({
				url, fileName, title = '', description, keywords, translation 
			}) => {
				const titleComponent = root.querySelector('title');

				const htmlElement = root.querySelector('html');
				if ( !translation ) {
					htmlElement?.removeAttribute('lang');
				}
				else {
					htmlElement?.setAttribute('lang', translation);
				}

				if ( titleComponent ) {
					titleComponent.innerHTML = title ?? '';
				}

				if ( config && config.url ) {
					findOrCreateMetaProperty(
						root,
						'og:url', 
						`${config.url}${url}`
					);

					findOrCreateMetaProperty(
						root,
						'twitter:url', 
						`${config.url}${url}`
					);
				}

				findOrCreateMeta(
					root,
					'title', 
					title
				);
				findOrCreateMetaProperty(
					root,
					'og:title', 
					title
				);
				findOrCreateMetaProperty(
					root,
					'twitter:title', 
					title
				);
				findOrCreateMetaItemProp(
					root,
					'name', 
					title
				);

				if ( description ) {
					findOrCreateMeta(root, 'description', description);
					findOrCreateMetaProperty(root, 'og:description', description);
					findOrCreateMetaProperty(root, 'twitter:description', description);
					findOrCreateMetaItemProp(
						root,
						'description', 
						description
					);
				}

				if ( keywords ) {
					findOrCreateMeta(root, 'keywords', keywords.join(', '));
				}

				return await createFile(
					fileName,
					await minifyFn(
						root.toString(), 
						getOptions(Boolean(rootConfig.build.minify) ?? true)
					),
					maxFileNameLength
				);
			}
		)
	);
}
