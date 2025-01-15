import { minify as minifyFn } from 'html-minifier-terser';
import { parse } from 'node-html-parser';
import { type ResolvedConfig } from 'vite';

import { createFile } from './createFile';
import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import { setRouteMetadata } from './setRouteMetadata';
import { getOptions } from './utils';

export type FilesType = { 
	fileName: string
	url: string
	description?: string
	keywords?: string[]
	title?: string
	translation?: string
};

export type CreateHtmlFilesConfig = {
	config: DefaultViteReactRouterConfig
	html: string
	maxFileNameLength: number
	pages: FilesType[]
	rootConfig: ResolvedConfig
};

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
			async (page) => {
				const {
					fileName, title = '', translation 
				} = page;
				
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

				setRouteMetadata(
					root,
					page,
					config
				);

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
