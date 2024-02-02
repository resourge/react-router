import path from 'path';

import { type ViteReactRouterConfig, type ViteReactRouterPathsType } from './type';

type FilesType = { 
	fileName: string
	url: string
	description?: string
	keywords?: string[]
	title?: string
	translation?: string
}

export const addFile = (
	getFolder: (route: string, translation?: string) => string, 
	{
		route, title: _title, description: _description, keywords: _keywords 
	}: ViteReactRouterPathsType,
	outputPath: string,
	filesNames: string[],
	config?: ViteReactRouterConfig
): FilesType[] => {
	const _route = route === '/' ? '' : route;
	const title = _title ?? config?.title;
	const description = _description ?? config?.description;
	const keywords = _keywords ?? config?.keywords;

	if ( typeof title === 'object' && typeof description === 'object' && typeof keywords === 'object' ) {
		const translations = Object.keys(title);

		const files = translations.map((translation) => {
			const folder = getFolder(_route, translation);
			const url = folder.replace('dist', '');
						
			const fileName = path.join(folder, './index.html');

			filesNames.push(
				fileName
			);

			return { 
				url,
				translation,
				fileName, 
				title: title[translation], 
				description: description[translation],
				keywords: (keywords as Record<string, any>)[translation]
			};
		});

		const folder = getFolder(_route);
		const url = folder.replace('dist', '');
						
		const fileName = path.join(folder, './index.html');

		filesNames.push(
			fileName
		);

		const translation = title.en ? 'en' : translations[0];

		files.unshift({ 
			url,
			translation,
			fileName, 
			title: title.en ?? title[translations[0]], 
			description: description.en ?? description[translations[0]],
			keywords: (keywords as Record<string, any>).en ?? (keywords as Record<string, any>)[translations[0]]
		});

		return files;
	}

	const folder = path.join(outputPath, _route);
	const url = folder.replace('dist', '');
				
	const fileName = path.join(folder, './index.html');

	filesNames.push(
		fileName
	);

	return [{ 
		url,
		translation: undefined,
		fileName, 
		title: title as string, 
		description: description as string,
		keywords: keywords as string[]
	}];
};
