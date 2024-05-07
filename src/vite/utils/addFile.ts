import path from 'path';

import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import { type ViteRouteMetadata } from './type';

type FilesType = { 
	fileName: string
	url: string
	description?: string
	keywords?: string[]
	title?: string
	translation?: string
};

export const addFile = (
	getFolder: (route: string, translation?: string) => string, 
	routeMetadata: ViteRouteMetadata,
	config: DefaultViteReactRouterConfig
): FilesType[] => {
	const _route = routeMetadata.route === config.defaultInitialRoute 
		? '' 
		: routeMetadata.route;

	const title = routeMetadata.title ?? config.title;
	const description = routeMetadata.description ?? config.description;
	const keywords = routeMetadata.keywords ?? config.keywords;

	const translations = Object.keys(title);

	// This is to make sure the actual route also gets an index.html
	const files = routeMetadata.route === config.defaultInitialRoute 
		? addFile(
			getFolder, 
			routeMetadata, 
			{
				...config,
				defaultInitialRoute: '-1'
			}
		) : [];
	
	if ( translations.length > 1 ) {
		files.push(
			...(
				translations.map((translation) => {
					const folder = getFolder(_route, translation);
					const url = folder.replace('dist', '');
							
					const fileName = path.join(folder, './index.html');

					return { 
						url,
						translation,
						fileName, 
						title: title[translation], 
						description: description[translation],
						keywords: keywords[translation]
					};
				})
			)
		);
	}

	const folder = getFolder(_route);
	const url = folder.replace('dist', '');
						
	const fileName = path.join(folder, './index.html');

	const translation = title[config.defaultLanguage] ? config.defaultLanguage : translations[0];
	const newTitle = title[config.defaultLanguage] ?? title[translations[0]];
	const newDescription = description[config.defaultLanguage] ?? description[translations[0]];
	const newKeywords = keywords[config.defaultLanguage] ?? keywords[translations[0]];

	files.unshift({ 
		url,
		translation,
		fileName, 
		title: newTitle,
		description: newDescription,
		keywords: newKeywords
	});

	return files;
};
