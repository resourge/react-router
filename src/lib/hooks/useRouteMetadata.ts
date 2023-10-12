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
			if ( props ) {
				if ( props.title ) {
					document.title = props.title
						? (
							typeof props.title === 'object' 
								? (
									lang ? props.title[lang] : ''
								) : props.title
						) : ''
				}

				// #region Description
				if ( props.description ) {
					let metaDescription = document.querySelector('meta[name="description"]');

					if ( !metaDescription ) {
						metaDescription = document.createElement('meta');

						metaDescription.setAttribute('name', 'description');
					}

					metaDescription.setAttribute(
						'content', 
						typeof props.description === 'object' 
							? (
								lang ? props.description[lang] : ''
							) : props.description
					)
				}
				// #endregion Description

				// #region Description
				if ( props.keywords ) {
					let metaKeywords = document.querySelector('meta[name="keywords"]');

					if ( !metaKeywords ) {
						metaKeywords = document.createElement('meta');

						metaKeywords.setAttribute('name', 'keywords');
					}

					metaKeywords.setAttribute(
						'content', 
						(
							Array.isArray(props.keywords)
								? props.keywords
								: (
									lang ? props.keywords[lang] : []
								)
						).join(', ')
					)
				}
				// #endregion Description

				return (previous) => {
					if ( previous ) {
						if ( previous.title ) {
							document.title = previous.title ?? '';
						}
						if ( previous.description ) {
							const metaDescription = document.querySelector('meta[name="description"]');
							if ( metaDescription ) {
								metaDescription.setAttribute('content', previous.description);
							}
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
		}
	)
}
