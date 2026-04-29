import { type AnchorHTMLAttributes, type MouseEvent } from 'react';

import { type NavigateOptions, useNavigate } from '../useNavigate/useNavigate';
import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

export type UseLinkProps = NavigateOptions 
	& {
		onClick?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
		target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
		to: NavigateTo
	};

function isModifiedEvent(event: MouseEvent<any>) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
export const useLink = ({
	action, onClick, preventScrollReset, replace, target, to
}: UseLinkProps) => {
	const navigate = useNavigate();
	const normalizeUrl = useNormalizeUrl();

	const url = normalizeUrl(to);

	const onNewClick = (event: MouseEvent<HTMLAnchorElement>) => {
		try {
			onClick?.(event);
		}
		catch (error) {
			event.preventDefault();
			throw error;
		}

		if (
			!event.defaultPrevented 
			&& event.button === 0 
			&& (
				!target || target === '_self'
			)
			&& !isModifiedEvent(event)
		) {
			event.preventDefault();
			navigate(
				url, 
				{
					action,
					preventScrollReset,
					replace 
				}
			);
		}
	};

	return [url, onNewClick] as const;
};
