import { useLayoutEffect, useState } from 'react';

import { useRoute } from '../contexts'
import { useLanguageContext } from '../contexts/LanguageContext';

export type RouteMetadataProps = {
	description?: string
	title?: string
}

const elementToObserve = document.querySelector('html') as HTMLHtmlElement;

const useLayoutLanguageEffect = <O>(
	dep: string | undefined, 
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
	const route = useRoute();

	const metadata = route.metadata;

	const _title = props?.title ?? metadata?.title;
	const _content = props?.description ?? metadata?.description;

	useLayoutLanguageEffect(
		_title, 
		() => document.title,
		(lang) => {
			if ( _title ) {
				document.title = _title
					? (
						typeof _title === 'object' 
							? (
								lang ? _title[lang] : ''
							) : _title
					) : ''

				return (previousTitle) => {
					document.title = previousTitle;
				}
			}
		}
	)

	useLayoutLanguageEffect(
		_content, 
		() => {
			const meta = document.querySelector('meta[name="description"]');
			return meta?.getAttribute('content') ?? ''
		},
		(lang) => {
			if ( _content ) {
				let meta = document.querySelector('meta[name="description"]');

				if ( !meta ) {
					meta = document.createElement('meta');

					meta.setAttribute('name', 'description');
				}

				meta.setAttribute(
					'content', 
					typeof _content === 'object' 
						? (
							lang ? _content[lang] : ''
						) : _content
				)

				return (previousDescription) => {
					const meta = document.querySelector('meta[name="description"]');
					if ( meta ) {
						meta.setAttribute('content', previousDescription);
					}
				}
			}
		}
	)

	return metadata;
}
