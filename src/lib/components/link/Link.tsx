import { type AnchorHTMLAttributes, forwardRef } from 'react';

import { useRouter } from '../../contexts/RouterContext';
import { useLink, type UseLinkProps } from '../../hooks/useLink/useLink';
import { type BaseMatchPathProps } from '../../hooks/useMatchPath';

export type LinkProps = BaseMatchPathProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'target'> 
	& UseLinkProps
	& {
		matchClassName?: string
		matchLink?: (url: URL, linkURL: URL) => boolean
	};

/**
 * Component extends element `a` and navigates to `to`.
 * 
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>((
	{ 
		action, 
		children,
		className,
		matchClassName,
		matchLink,
		onClick: _onClick,
		preventScrollReset,
		replace,
		target,
		to,
		...props 
	},
	ref
) => {
	const { url } = useRouter();
	const [linkURL, onClick] = useLink({
		action,
		onClick: _onClick,
		preventScrollReset,
		replace,
		target,
		to
	});
	const isActive = matchLink
		? matchLink(url, linkURL)
		: (linkURL.href === url.href);

	const combinedClassName = [
		className, isActive
			? matchClassName
			: ''
	]
	.filter(Boolean)
	.join(' ');

	return (
		<a
			{...props}
			className={combinedClassName || undefined}
			href={linkURL.href}
			onClick={onClick}
			ref={ref}
		>
			{ children }
		</a>
	);
});

Link.displayName = 'Link';

export default Link;
