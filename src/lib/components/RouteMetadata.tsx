import { type ReactNode } from 'react';

import { useHtmlLanguage } from '../hooks/useHtmlLanguage';
import { type RouteMetadataType } from '../types/RouteMetadataType';

import Meta from './Meta';
import Title from './Title';

function getTitle(metadata: RouteMetadataType, lang?: string) {
	return metadata.title
		? (
			typeof metadata.title === 'object' 
				? (
					lang 
						? metadata.title[lang] 
						: ''
				) : metadata.title
		) : '';
}

function getDescription(metadata: RouteMetadataType, lang?: string) {
	return metadata.description
		? (
			typeof metadata.description === 'object' 
				? (
					lang ? metadata.description[lang] : ''
				) : metadata.description
		)
		: '';
}

const INITIAL_KEYWORDS = (document.querySelector('meta[name="keywords"]')?.getAttribute('content') ?? '').split(',').map((keyword) => keyword.trim())
.join(', ');

const META_COMPONENTS = {
	description: {
		name: 'description',
		content: getDescription
	},
	keywords: {
		name: 'keywords',
		content: (metadata: RouteMetadataType, lang?: string) => (
			metadata.keywords
				? (
					Array.isArray(metadata.keywords)
						? metadata.keywords
						: (
							lang ? metadata.keywords[lang] : []
						)
				).join(', ')
				: INITIAL_KEYWORDS
		)
	},

	title: {
		name: 'title',
		content: getTitle
	},
	image: {
		itemprop: 'image',
		content: () => '/favicon.ico'
	},
	name: {
		itemprop: 'name',
		content: getTitle
	},
	itemprop_description: {
		itemprop: 'description',
		content: getDescription
	},

	'og:url': {
		property: 'og:url',
		content: () => window.location.href
	},
	'og:title': {
		property: 'og:title',
		content: getTitle
	},
	'og:description': {
		property: 'og:description',
		content: getDescription
	},
	'og:type': {
		property: 'og:type',
		content: () => 'website'
	},
	'og:image': {
		property: 'og:image',
		content: () => '/favicon.ico'
	},

	'twitter:url': {
		property: 'twitter:url',
		content: () => window.location.href
	},
	'twitter:title': {
		property: 'twitter:title',
		content: getTitle
	},
	'twitter:description': {
		property: 'twitter:description',
		content: getDescription
	},
	'twitter:card': {
		property: 'twitter:card',
		content: () => 'summary_large_image'
	},
	'twitter:image': {
		property: 'twitter:image',
		content: () => '/favicon.ico'
	}
};

const META_COMPONENTS_ARR = Object.keys(META_COMPONENTS);

function RouteMetadata({ children }: { children: ReactNode }) {
	const lang = useHtmlLanguage();
	const { type } = children as any;

	const metadata: RouteMetadataType = type.routeMetadata ?? type?._payload?._result?.default?.routeMetadata;

	if ( !metadata ) {
		return (<></>);
	}

	return (
		<>
			<Title>
				{ getTitle(metadata, lang) }
			</Title>
			{
				META_COMPONENTS_ARR.map((key) => {
					const { content, ...attrs } = META_COMPONENTS[key as keyof typeof META_COMPONENTS];

					return (
						<Meta
							key={key}
							content={content(metadata, lang)}
							{...attrs as Record<string, string>}
						/>
					);
				})
			}
		</>
	);
};

export default RouteMetadata;
