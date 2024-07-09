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
	props,
	ref
) => {
	const { 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		to, 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		replace,

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		exact,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		hash,

		className,
		matchClassName,
		children,
		...aProps 
	} = props;
	const { url } = useRouter();
	const [href, onClick] = useLink(props);
	const match = href === url.href;

	const _class = [className, match ? matchClassName : ''].filter((cn) => cn) as string[];

	const _className = _class && _class.length ? _class.join(' ') : undefined;

	return (
		<a
			{...aProps}
			ref={ref}
			className={_className}
			href={href}
			onClick={onClick}
		>
			{ children }
		</a>
	);
});

Link.displayName = 'Link';

export default Link;
