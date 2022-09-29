const fs = require('fs');
const path = require('path');

const fixTypes = (typePath) => {
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