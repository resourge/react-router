import { type HTMLElement } from 'node-html-parser';

import { type FilesType } from './createHtmlFiles';
import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import { findOrCreateMeta, findOrCreateMetaItemProp, findOrCreateMetaProperty } from './utils';

export const META_COMPONENTS = {
	'description': (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMeta(root, 'description', description);
		}
	},
	'image': (root: HTMLElement) => {
		findOrCreateMetaItemProp(root, 'image', '/favicon.ico');
	},

	'itemprop_description': (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMetaItemProp(root, 'description', description);
		}
	},
	'keywords': (root: HTMLElement, { keywords }: FilesType) => {
		if ( keywords ) {
			findOrCreateMeta(root, 'keywords', keywords.join(', '));
		}
	},
	'name': (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMetaItemProp(root, 'name', title);
		}
	},
	'og:description': (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMetaProperty(root, 'og:description', description);
		}
	},

	'og:image': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'og:image', '/favicon.ico');
	},
	'og:title': (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMetaProperty(root, 'og:title', title);
		}
	},
	'og:type': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'og:type', 'website');
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
	'title': (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMeta(root, 'title', title);
		}
	},

	'twitter:card': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'twitter:card', 'summary_large_image');
	},
	'twitter:description': (root: HTMLElement, { description }: FilesType) => {
		if ( description ) {
			findOrCreateMetaProperty(root, 'twitter:description', description);
		}
	},
	'twitter:image': (root: HTMLElement) => {
		findOrCreateMetaProperty(root, 'twitter:imagee', '/favicon.ico');
	},
	'twitter:title': (root: HTMLElement, { title }: FilesType) => {
		if ( title ) {
			findOrCreateMetaProperty(root, 'twitter:title', title);
		}
	},
	'twitter:url': (root: HTMLElement, { url }: FilesType, config: DefaultViteReactRouterConfig) => {
		if ( config && config.url ) {
			findOrCreateMetaProperty(
				root,
				'twitter:url', 
				`${config.url}${url}`
			);
		}
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
