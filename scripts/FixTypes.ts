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

	// Fix _resourge_react_search_params
	content = content.replace("import * as _resourge_react_search_params from '@resourge/react-search-params';", '');

	// Fix _resourge_react_search_params
	content = content.replace(/_resourge_react_search_params./g, '');

	//Fix SetupPaths
	content = content.replace(/export.*SetupPaths-.*';/g, "");
	content = content.replace("import 'src/lib/hooks/useParams';", "");

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