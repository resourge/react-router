import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const fixTypes = (typePath: string) => {
	const typesFilePath = path.resolve(__dirname, typePath);

	let content = fs.readFileSync(typesFilePath, 'utf-8');
	
	// content = content.replace("import { generatePath, createPathWithCurrentLocationHasHash } from 'src/lib/utils/generatePath';", "");
	// Remove SetupPaths from index.js
	content = content.replace("import { generatePath } from 'src/lib/utils/generatePath';", "");
	content = content.replace(/'src\/lib\/.*'/g, "'../index'");
	content = content.replace("import { useParams }", "import { useParams, generatePath }");


	// Write File
	fs.writeFileSync(typesFilePath, content);
}

fixTypes('../dist/setupPaths/index.js')
fixTypes('../dist/setupPaths/index.d.ts')