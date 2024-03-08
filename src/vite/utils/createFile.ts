import ansi from 'ansi-colors';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

function ensureDirectoryExists(filePath: string): void {
	const dirname = path.dirname(filePath);
	if (!fs.existsSync(dirname)) {
		fs.mkdirSync(dirname, {
			recursive: true 
		});
	}
}

export async function createFile(fileName: string, body: string, maxFileNameLength: number) {
	ensureDirectoryExists(fileName);

	await fsp.writeFile(
		fileName, 
		body
	);

	const stats = fs.statSync(fileName);
	const size = `${(stats.size / 1024).toFixed(2)} kB`;
	return `${ansi.dim(`${path.dirname(fileName)}/`)}${ansi.cyan(path.basename(fileName))}${' '.repeat(3 + (maxFileNameLength - fileName.length))}${size}`;
}
