import { type AnchorHTMLAttributes, type MouseEvent } from 'react';

import { type NavigateOptions, useNavigate } from './useNavigate';
import { type NavigateTo, useNormalizeUrl } from './useNormalizeUrl';

export type UseLinkProps = {
	to: NavigateTo
} 
& NavigateOptions
& Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

function isModifiedEvent(event: MouseEvent<any>) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
export const useLink = ({
	to, replace, preventScrollReset, action, ...aProps 
}: UseLinkProps) => {
	const navigate = useNavigate();
	const normalizeUrl = useNormalizeUrl();

	const url = normalizeUrl(to);

	const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
		try {
			if (aProps.onClick) aProps.onClick(event);
		}
		catch (ex) {
			event.preventDefault();
			throw ex;
		}

		if (
			!event.defaultPrevented 
			&& event.button === 0 && (
				!aProps.target || aProps.target === '_self'
			)
			&& !isModifiedEvent(event)
		) {
			event.preventDefault();
			navigate(
				url, 
				{
					action,
					replace,
					preventScrollReset 
				}
			);
		}
	};

	return [url.href, onClick] as const;
};
