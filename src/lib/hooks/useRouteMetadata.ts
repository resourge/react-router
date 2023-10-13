import { useLayoutEffect } from 'react';

import { useLanguageContext } from '../contexts/LanguageContext';
import { type RouteMetadata } from '../types';

export type RouteMetadataProps = Omit<RouteMetadata, 'route'>

const useLayoutLanguageEffect = <O>(
	dep: O, 
	cb: (language: string) => void
) => {
	const baseLanguage = useLanguageContext();

	useLayoutEffect(() => {
		const _language = baseLanguage ?? document.documentElement.lang;

		cb(_language);

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
		(lang) => {
			document.title = props?.title
				? (
					typeof props.title === 'object' 
						? (
							lang ? props.title[lang] : ''
						) : props.title
				) : ''

			// #region Description
			let metaDescription = document.querySelector('meta[name="description"]');

			if ( !metaDescription ) {
				metaDescription = document.createElement('meta');

				metaDescription.setAttribute('name', 'description');
			}

			metaDescription.setAttribute(
				'content', 
				props?.description
					? (
						typeof props.description === 'object' 
							? (
								lang ? props.description[lang] : ''
							) : props.description
					)
					: ''
			)
			// #endregion Description

			// #region Description
			let metaKeywords = document.querySelector('meta[name="keywords"]');

			if ( !metaKeywords ) {
				metaKeywords = document.createElement('meta');

				metaKeywords.setAttribute('name', 'keywords');
			}

			metaKeywords.setAttribute(
				'content', 
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
			// #endregion Description
		}
	)
}
