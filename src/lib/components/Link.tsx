import { AnchorHTMLAttributes, ForwardedRef, forwardRef, MouseEvent } from 'react';

import { useLocation } from '../hooks/useLocation';
import { useNavigate, NavigateOptions } from '../hooks/useNavigate';
import { resolveToLocation } from '../utils/createLocation';

export type LinkProps = {
	to: string
} 
& NavigateOptions
& Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

function isModifiedEvent(event: MouseEvent<any>) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Component extends element `a` and navigates to `to`.
 */
const Link = forwardRef((
	{ 
		to, 
		replace,
		resolveToLocation: _resolveToLocation,
		...aProps 
	}: LinkProps,
	ref: ForwardedRef<HTMLAnchorElement>
) => {
	const navigate = useNavigate();
	const location = useLocation();

	let href = to;

	if ( _resolveToLocation ) {
		href = resolveToLocation(href, location.path).path
	}

	const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
		try {
			if (aProps.onClick) aProps.onClick(event);
		}
		catch (ex) {
			event.preventDefault();
			throw ex;
		}

		if (
			!event.defaultPrevented && 
			event.button === 0 && (
				!aProps.target || aProps.target === '_self'
			) &&
			!isModifiedEvent(event)
		) {
			event.preventDefault();
			navigate(to, { replace, resolveToLocation: _resolveToLocation });
		}
	}

	return (
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		<a {...aProps} ref={ref} href={href} onClick={onClick} />
	);
});

export default Link;
