import { type ForwardedRef, forwardRef } from 'react';

import { useRouter } from '../contexts/RouterContext';
import { useLink, type UseLinkProps } from '../hooks/useLink';
import { type MatchPathProps } from '../hooks/useMatchPath';

export type LinkProps = UseLinkProps & {
	matchClassName?: string
} & Omit<MatchPathProps, 'path'>

/**
 * Component extends element `a` and navigates to `to`.
 * 
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
const Link = forwardRef((
	props: LinkProps,
	ref: ForwardedRef<HTMLAnchorElement>
) => {
	const { 
		to, 
		replace,

		exact,
		hash,

		className,
		matchClassName,

		...aProps 
	} = props
	const { url } = useRouter();
	const [href, onClick] = useLink(props)
	const match = href === url.href;

	const _class = [className, match ? matchClassName : ''].filter(cn => cn);

	const _className = _class && _class.length ? _class.join(' ') : undefined;

	return (
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		<a {...aProps} ref={ref} className={_className} href={href} onClick={onClick} />
	);
});

Link.displayName = 'Link'

export default Link;
