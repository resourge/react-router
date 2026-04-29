import ansi from 'ansi-colors';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

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

/**
 * Ensures that the directory for a given file path exists.
 * 
 * @param filePath - The path of the file for which the directory should be ensured.
 */
function ensureDirectoryExists(filePath: string): void {
	const dirname = path.dirname(filePath);
	if (!fs.existsSync(dirname)) {
		fs.mkdirSync(dirname, {
			recursive: true 
		});
	}
}
