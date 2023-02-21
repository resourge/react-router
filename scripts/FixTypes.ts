import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const fixTypes = (typePath: string) => {
	const typesFilePath = path.resolve(__dirname, typePath);

	let content = fs.readFileSync(typesFilePath, 'utf-8');

	// Change declare to export
	content = content.replace(/declare/g, 'export declare');

	content = content.replace(`
    [K in keyof R]: PathType<R[K]['_routes'], R[K]['_params'], R[K]['_useParams']>`, `
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof R]: PathType<R[K]['_routes'], R[K]['_params'], R[K]['_useParams']>`)

	content = content.replace(`
    [K in keyof Paths]: PathType<Paths[K]['_routes'], Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams>`, `
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof Paths]: PathType<Paths[K]['_routes'], Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams>`)

	content = content.replace(`
    [K in keyof Paths]: Path<Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams, InjectParamsIntoPath<Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams, Paths[K]['_routes']>>;`, `
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof Paths]: Path<Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams, InjectParamsIntoPath<Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams, Paths[K]['_routes']>>;`)

	// Remover last export
	const lastExport = content.lastIndexOf('export {');
	content = content.substring(0, lastExport);

	// Remove last line break
	const lastLine = content.lastIndexOf('\n');
	content = content.substring(0, lastLine);

	// Remove export form global
	content = content.replace(/export declare global/g, 'declare global');

	// Write File
	fs.writeFileSync(typesFilePath, content);
}

fixTypes('../dist/index.d.ts')