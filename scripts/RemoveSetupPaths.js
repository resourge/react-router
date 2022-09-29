const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, '../dist');

const files = fs.readdirSync(distPath);

const file = files.find((file) => file.startsWith('SetupPaths-'));

if ( file ) {
	const filePath = path.resolve(distPath, file);

	const content = fs.readFileSync(filePath, 'utf-8');

	const setupPathsIndexPath = path.resolve(distPath, 'setupPaths/index.d.ts');
	fs.writeFileSync(setupPathsIndexPath, content);

	fs.unlinkSync(filePath)
}
