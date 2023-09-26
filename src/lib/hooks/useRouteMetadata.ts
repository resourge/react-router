import { useEffect } from 'react';

import { useRoute } from '../contexts'
import { useLanguageContext } from '../contexts/LanguageContext';

/**
 * Hook set page title and description.
 *
 * @param title - Custom page title. For dynamic pages or for custom title.
 */
export const useRouteMetadata = (title?: string) => {
	const route = useRoute();
	const base = useLanguageContext();

	const metadata = route.metadata;

	useEffect(() => {
		if ( metadata?.title ?? title ) {
			const previousTitle = document.title;
			document.title = !title
				? (
					metadata?.title 
						? (
							typeof metadata.title === 'object' 
								? (
									base ? metadata.title[base] : ''
								) : metadata.title
						) : ''
				) : title

			return () => {
				document.title = previousTitle;
			}
		}
	}, [base, metadata?.title, title])

	useEffect(() => {
		if ( metadata?.description ) {
			let meta = document.querySelector('meta[name="description"]');

			if ( !meta ) {
				meta = document.createElement('meta');

				meta.setAttribute('name', 'description');
			}
			const previousDescription = meta.getAttribute('content') ?? '';
			
			meta.setAttribute('content', 
				typeof metadata.description === 'object' 
					? (
						base ? metadata.description[base] : ''
					) : metadata.description
			)

			return () => {
				const meta = document.querySelector('meta[name="description"]');
				if ( meta ) {
					meta.setAttribute('content', previousDescription);
				}
			}
		}
	}, [base, metadata?.description])

	return metadata;
}
