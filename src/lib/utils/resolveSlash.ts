/**
 * Resolves slash
 */
export function resolveSlash(...args: Array<string | undefined>) {
	return `/${(args.filter((pathname) => pathname) as string[])
	.map((pathname) => pathname.trim().replace(/^\/|\/$/g, '')) // Remove leading and trailing slashes
	.join('/')}`;
}
