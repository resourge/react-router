import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

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
