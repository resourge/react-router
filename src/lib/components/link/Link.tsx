import { forwardRef, type AnchorHTMLAttributes } from 'react';

import { useRouter } from '../../contexts/RouterContext';
import { useLink, type UseLinkProps } from '../../hooks/useLink/useLink';
import { type BaseMatchPathProps } from '../../hooks/useMatchPath';

export type LinkProps = UseLinkProps & {
	matchClassName?: string
} 
& BaseMatchPathProps
& Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'target'>;

/**
 * Component extends element `a` and navigates to `to`.
 * 
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>((
	{ 
		to, 
		replace,
		className,
		matchClassName,
		children,
		preventScrollReset,
		action,
		onClick: _onClick,
		target,
		...props 
	},
	ref
) => {
	const { url } = useRouter();
	const [href, onClick] = useLink({
		to, replace, preventScrollReset, action, onClick: _onClick, target
	});
	const isActive = href === url.href;

	const combinedClassName = [className, isActive ? matchClassName : '']
	.filter(Boolean)
	.join(' ');

	return (
		<a
			{...props}
			ref={ref}
			className={combinedClassName || undefined}
			href={href}
			onClick={onClick}
		>
			{ children }
		</a>
	);
});

Link.displayName = 'Link';

export default Link;
