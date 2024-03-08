import { type HTMLElement } from 'node-html-parser';

import { type FilesType } from './createHtmlFiles';
import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import { findOrCreateMeta, findOrCreateMetaItemProp, findOrCreateMetaProperty } from './utils';

export const META_COMPONENTS = {
	description: (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMeta(root, 'description', description);
		}
	},
	keywords: (root: HTMLElement, { keywords }: FilesType) => {
		if ( keywords ) {
			findOrCreateMeta(root, 'keywords', keywords.join(', '));
		}
	},

	title: (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMeta(root, 'title', title);
		}
	},
	image: (root: HTMLElement) => {
		findOrCreateMetaItemProp(root, 'image', '/favicon.ico');
	},
	name: (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMetaItemProp(root, 'name', title);
		}
	},
	itemprop_description: (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMetaItemProp(root, 'description', description);
		}
	},

	'og:url': (root: HTMLElement, { url }: FilesType, config: DefaultViteReactRouterConfig) => {
		if ( config && config.url ) {
			findOrCreateMetaProperty(
				root,
				'og:url', 
				`${config.url}${url}`
			);
		}
	},
	'og:title': (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMetaProperty(root, 'og:title', title);
		}
	},
	'og:description': (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMetaProperty(root, 'og:description', description);
		}
	},
	'og:type': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'og:type', 'website');
	},
	'og:image': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'og:image', '/favicon.ico');
	},

	'twitter:url': (root: HTMLElement, { url }: FilesType, config: DefaultViteReactRouterConfig) => {
		if ( config && config.url ) {
			findOrCreateMetaProperty(
				root,
				'twitter:url', 
				`${config.url}${url}`
			);
		}
	},
	'twitter:title': (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMetaProperty(root, 'twitter:title', title);
		}
	},
	'twitter:description': (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMetaProperty(root, 'twitter:description', description);
		}
	},
	'twitter:card': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'twitter:card', 'summary_large_image');
	},
	'twitter:image': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'twitter:imagee', '/favicon.ico');
	}
};

export function setRouteMetadata(
	root: HTMLElement,
	page: FilesType,
	config: DefaultViteReactRouterConfig
) {
	Object.values(META_COMPONENTS)
	.forEach((cb) => {
		cb(root, page, config);
	});
}
