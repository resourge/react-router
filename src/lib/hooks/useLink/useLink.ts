import { type AnchorHTMLAttributes, type MouseEvent } from 'react';

import { useNavigate, type NavigateOptions } from '../useNavigate/useNavigate';
import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

export type UseLinkProps = {
	to: NavigateTo
	onClick?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
	target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
} 
& NavigateOptions;

function isModifiedEvent(event: MouseEvent<any>) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
export const useLink = ({
	to, replace, preventScrollReset, action, onClick, target
}: UseLinkProps) => {
	const navigate = useNavigate();
	const normalizeUrl = useNormalizeUrl();

	const url = normalizeUrl(to);

	const onNewClick = (event: MouseEvent<HTMLAnchorElement>) => {
		try {
			if (onClick) onClick(event);
		}
		catch (ex) {
			event.preventDefault();
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw ex;
		}

		if (
			!event.defaultPrevented 
			&& event.button === 0 && (
				!target || target === '_self'
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

	return [url.href, onNewClick] as const;
};
