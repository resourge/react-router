import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const fixTypes = (typePath: string) => {
	const typesFilePath = path.resolve(__dirname, typePath);

	let content = fs.readFileSync(typesFilePath, 'utf-8');

	content = content.replace(`
    [K in keyof Routes]: PathType<ResolveSlash<[IsHashPath<Routes[K]['_key']> extends true ? '' : BaseKey, Routes[K]['_key']]>, IsHashPath<Routes[K]['_key']> extends true ? Routes[K]['_params'] : MergeObj<Params, Routes[K]['_params']>, IsHashPath<Routes[K]['_key']> extends true ? Routes[K]['_paramsResult'] : MergeObj<ParamsResult, Routes[K]['_paramsResult']>, Routes[K]['_routes']>;`, `
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof Routes]: PathType<ResolveSlash<[IsHashPath<Routes[K]['_key']> extends true ? '' : BaseKey, Routes[K]['_key']]>, IsHashPath<Routes[K]['_key']> extends true ? Routes[K]['_params'] : MergeObj<Params, Routes[K]['_params']>, IsHashPath<Routes[K]['_key']> extends true ? Routes[K]['_paramsResult'] : MergeObj<ParamsResult, Routes[K]['_paramsResult']>, Routes[K]['_routes']>;`)

	content = content.replace(`
    [K in keyof R]: PathType<IsHashPath<R[K]['_key']> extends true ? R[K]['_key'] : IncludeSlash<R[K]['_key']>, R[K]['_params'], R[K]['_paramsResult'], R[K]['_routes']>;`, `
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof R]: PathType<IsHashPath<R[K]['_key']> extends true ? R[K]['_key'] : IncludeSlash<R[K]['_key']>, R[K]['_params'], R[K]['_paramsResult'], R[K]['_routes']>;`)

	// Change declare to export
	content = content.replace(/declare/g, 'export declare');

	// Remover last export
	const lastExport = content.lastIndexOf('export {');
	content = content.substring(0, lastExport);

	// Remove last line break
	const lastLine = content.lastIndexOf('\n');
	content = content.substring(0, lastLine);

	content += `
declare module 'react' {
	export interface FunctionComponent {
		routeMetadata?: RouteMetadataType<any, any, any>
	}
}`;

	// Write File
	fs.writeFileSync(typesFilePath, content);
}

fixTypes('../dist/index.d.ts')