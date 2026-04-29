/**
 * Resolves slash
 */
export function resolveSlash(...args: Array<string | undefined>) {
	return `/${(args.filter(Boolean) as string[])
	.map((pathname) => pathname.trim().replaceAll(/^\/|\/$/g, '')) // Remove leading and trailing slashes
	.join('/')}`;
}
