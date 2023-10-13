import { useLayoutEffect, useState } from 'react';

import { useLanguageContext } from '../contexts/LanguageContext';
import { type RouteMetadata } from '../types';

export type RouteMetadataProps = Omit<RouteMetadata, 'route'>

const useLayoutLanguageEffect = <O>(
	dep: O, 
	originalValueCb: () => O, 
	cb: (language: string) => ((originalValue: O) => void) | undefined
) => {
	const baseLanguage = useLanguageContext();
	const [originalValue] = useState(originalValueCb)

	useLayoutEffect(() => {
		const _language = baseLanguage ?? document.documentElement.lang;

		const unmount = cb(_language);

		const observer = new MutationObserver(() => {
			cb(document.documentElement.lang)
		});

		if ( !baseLanguage ) {
			const elementToObserve = document.querySelector('html') as HTMLHtmlElement;
			observer.observe(elementToObserve, {
				attributes: true,
				attributeFilter: ['lang'] 
			});
		}

		return () => {
			unmount && unmount(originalValue)
			if ( !baseLanguage ) {
				observer.disconnect();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [baseLanguage, dep])
}

function findOrCreateMeta(metaName: string, value: string, propertyName: string = 'name') {
	let metaElement = document.querySelector(`meta[${propertyName}="${metaName}"]`);

	if ( !metaElement ) {
		metaElement = document.createElement('meta');

		metaElement.setAttribute(propertyName, metaName);

		document.head.appendChild(metaElement);
	}

	metaElement.setAttribute(
		'content', 
		value
	)
}

function findOrCreateMetaProperty(metaName: string, value: string) {
	findOrCreateMeta(metaName, value, 'property')
}

/**
 * Hook set page title and description.
 *
 * @param language - Custom language. For dynamic language.
 */
export const useRouteMetadata = (props?: RouteMetadataProps) => {
	useLayoutLanguageEffect(
		props, 
		() => {
			const title = document.title;

			const metaDescription = document.querySelector('meta[name="description"]');
			const description = metaDescription?.getAttribute('content') ?? ''

			const metaKeywords = document.querySelector('meta[name="keywords"]');
			const keywords = metaKeywords ? (metaKeywords.getAttribute('content') ?? '').split(',').map((keyword) => keyword.trim()) : [];

			return {
				title,
				description,
				keywords
			}
		},
		(lang) => {
			document.title = props?.title
				? (
					typeof props.title === 'object' 
						? (
							lang ? props.title[lang] : ''
						) : props.title
				) : ''

			// #region ogUrl
			findOrCreateMetaProperty(
				'og:url', 
				window.location.href
			)
			// #endregion ogUrl

			// #region twitterUrl
			findOrCreateMetaProperty(
				'twitter:url', 
				window.location.href
			)
			// #endregion twitterUrl

			// #region ogTitlew
			findOrCreateMetaProperty(
				'og:title', 
				document.title
			)
			// #endregion ogTitle

			// #region twitterTitle
			findOrCreateMetaProperty(
				'twitter:title', 
				document.title
			)
			// #endregion twitterTitle

			const description = props?.description
				? (
					typeof props.description === 'object' 
						? (
							lang ? props.description[lang] : ''
						) : props.description
				)
				: '';
			// #region Description
			findOrCreateMeta(
				'description', 
				description
			)
			// #endregion Description

			// #region ogDescription
			findOrCreateMetaProperty(
				'og:description', 
				description
			)
			// #endregion ogDescription

			// #region twitterDescription
			findOrCreateMetaProperty(
				'twitter:description', 
				description
			)
			// #endregion twitterDescription

			// #region keywords
			findOrCreateMeta(
				'keywords', 
				(
					props?.keywords
						? (
							Array.isArray(props.keywords)
								? props.keywords
								: (
									lang ? props.keywords[lang] : []
								)
						).join(', ')
						: ''
				)
			)
			// #endregion keywords

			return (previous) => {
				if ( previous ) {
					if ( previous.title ) {
						document.title = previous.title ?? '';
						findOrCreateMetaProperty(
							'og:title', 
							previous.title
						)

						findOrCreateMetaProperty(
							'twitter:title', 
							previous.title
						)
					}
					if ( previous.description ) {
						findOrCreateMeta(
							'description', 
							previous.description
						)

						findOrCreateMetaProperty(
							'og:description', 
							previous.description
						)

						findOrCreateMetaProperty(
							'twitter:description', 
							previous.description
						)
					}
					if ( previous.keywords ) {
						const metaKeywords = document.querySelector('meta[name="keywords"]');
						if ( metaKeywords ) {
							metaKeywords.setAttribute('content', previous.keywords.join(', '));
						}
					}
				}
			}
		}
	)
}
