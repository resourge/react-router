import { type ReactNode } from 'react';

import { useHtmlLanguage } from '../../hooks/useHtmlLanguage/useHtmlLanguage';
import { type RouteMetadataType } from '../../types/RouteMetadataType';
import Meta from '../meta/Meta';
import Title from '../title/Title';

function getLocalizedContent(metadata?: Record<string, string> | string, lang?: string) {
	if ( !metadata ) {
		return '';
	}
	return typeof metadata === 'object' 
		? (
			lang 
				? metadata[lang] 
				: ''
		)
		: metadata;
}

const getTitle = (metadata: RouteMetadataType, lang?: string) => getLocalizedContent(metadata.title, lang);
const getDescription = (metadata: RouteMetadataType, lang?: string) => getLocalizedContent(metadata.description, lang);

const INITIAL_KEYWORDS = globalThis.document 
	? (document.querySelector('meta[name="keywords"]')?.getAttribute('content') ?? '').split(',').map((keyword) => keyword.trim())
	.join(', ')
	: '';

const META_COMPONENTS = {
	'description': {
		content: getDescription,
		name: 'description'
	},
	'image': {
		content: () => '/favicon.ico',
		itemprop: 'image'
	},

	'itemprop_description': {
		content: getDescription,
		itemprop: 'description'
	},
	'keywords': {
		content: (metadata: RouteMetadataType, lang?: string) => (
			metadata.keywords
				? (
					Array.isArray(metadata.keywords)
						? metadata.keywords
						: (
							lang
								? metadata.keywords[lang]
								: []
						)
				).join(', ')
				: INITIAL_KEYWORDS
		),
		name: 'keywords'
	},
	'name': {
		content: getTitle,
		itemprop: 'name'
	},
	'og:description': {
		content: getDescription,
		property: 'og:description'
	},

	'og:image': {
		content: () => '/favicon.ico',
		property: 'og:image'
	},
	'og:title': {
		content: getTitle,
		property: 'og:title'
	},
	'og:type': {
		content: () => 'website',
		property: 'og:type'
	},
	'og:url': {
		content: () => globalThis.location.href,
		property: 'og:url'
	},
	'title': {
		content: getTitle,
		name: 'title'
	},

	'twitter:card': {
		content: () => 'summary_large_image',
		property: 'twitter:card'
	},
	'twitter:description': {
		content: getDescription,
		property: 'twitter:description'
	},
	'twitter:image': {
		content: () => '/favicon.ico',
		property: 'twitter:image'
	},
	'twitter:title': {
		content: getTitle,
		property: 'twitter:title'
	},
	'twitter:url': {
		content: () => globalThis.location.href,
		property: 'twitter:url'
	}
};

const META_COMPONENTS_ARR = Object.keys(META_COMPONENTS);

/**
 * @platform web
 */
function RouteMetadata({ children }: { children: ReactNode }) {
	const lang = useHtmlLanguage();
	const { type } = children as any;

	const metadata: RouteMetadataType = type?.routeMetadata ?? type?._payload?._result?.default?.routeMetadata;

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
							content={content(metadata, lang)}
							key={key}
							{...attrs as Record<string, string>}
						/>
					);
				})
			}
		</>
	);
};

export default RouteMetadata;
