import path from 'path';

import { createFile } from './createFile';
import { type FilesType } from './createHtmlFiles';
import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';

export type CreateSiteMapConfig = {
	config: DefaultViteReactRouterConfig
	maxFileNameLength: number
	outputPath: string
	pages: FilesType[]
}

export function createSiteMap({
	pages, 
	outputPath,
	maxFileNameLength,
	config
}: CreateSiteMapConfig) {
	const today = new Date();
	const date = today.toISOString().split('T')[0];

	const pagesXml = pages.map(({ url }) => {
		return [
			'<url>',
			`<loc>${path.join(config.url ?? '', url)}</loc>`,
			`<lastmod>${date}</lastmod>`,
			'<changefreq>daily</changefreq>',
			'<priority>1.0</priority>',
			'</url>'
		];
	});

	return createFile(
		path.join(outputPath, 'sitemap.xml'),
		[
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			...pagesXml.flat(),
			'</urlset>'
		].join(''),
		maxFileNameLength
	);
}
