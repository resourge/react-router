import {
	forwardRef,
	type ForwardRefExoticComponent,
	type PropsWithoutRef,
	type RefAttributes
} from 'react';

import { useRouter } from '../contexts/RouterContext';
import { useLink, type UseLinkProps } from '../hooks/useLink';
import { type BaseMatchPathProps } from '../hooks/useMatchPath';

export type LinkProps = UseLinkProps & {
	matchClassName?: string
} & BaseMatchPathProps

/**
 * Component extends element `a` and navigates to `to`.
 * 
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
const Link: ForwardRefExoticComponent<PropsWithoutRef<LinkProps> & RefAttributes<HTMLAnchorElement>> = forwardRef((
	props,
	ref
) => {
	const { 
		to, 
		replace,

		exact,
		hash,

		className,
		matchClassName,
		children,
		...aProps 
	} = props;
	const { url } = useRouter();
	const [href, onClick] = useLink(props);
	const match = href === url.href;

	const _class = [className, match ? matchClassName : ''].filter(cn => cn);

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
