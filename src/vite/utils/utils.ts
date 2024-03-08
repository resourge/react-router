import * as babel from '@babel/core';
import { type Options as MinifyOptions } from 'html-minifier-terser';
import { type HTMLElement } from 'node-html-parser';
import path from 'path';

export function replaceExtension(filename: string, newExtension: string) {
	// Use path module to parse the filename
	const parsedPath = path.parse(filename);

	// Replace the extension with the new one
	parsedPath.ext = newExtension;

	// Use path.format to get the modified filename
	const modifiedFilename = path.format(parsedPath);

	return modifiedFilename;
}

export function stripCodeOfUnnecessaryCode(fileContent: string, functionNameToRemove: string) {
	const transpiledCode = babel.transformSync(fileContent, {
		presets: [
			[
				'@babel/preset-typescript',
				{
					isTSX: true,
					allExtensions: true 
				}
			]
		],
		ast: true
	});

	if ( transpiledCode ) {
		const ast = transpiledCode.ast;

		if ( ast ) {
			const usedImports = new Set();

			babel.traverse(ast, {
				FunctionDeclaration(path) {
					const functionName = path.node.id?.name;
					if (functionName === functionNameToRemove) {
						path.get('body').replaceWithMultiple([]);
					}
				},
				ArrowFunctionExpression(path) {
					// @ts-expect-error It works but doesn't exist?
					const functionName = path.parent.id?.name;
					if (functionName === functionNameToRemove) {
						path.get('body').replaceWithMultiple([]);// Remove the entire ArrowFunctionExpression
					}
				},
				ImportDeclaration(path) {
					const importName = path.node.source.value;
					usedImports.add(importName);
				},
				Identifier(path) {
					// Collect identifiers used in other contexts, e.g., function arguments
					usedImports.add(path.node.name);
				}
			});

			// Use AST traversal to collect used imports
			babel.traverse(ast, {
				ImportDeclaration(path) {
					const importName = path.node.source.value;

					if (!usedImports.has(importName)) {
						// Remove the import statement if it's not used
						path.remove();
					}
				}
			});

			const modifiedCode = babel.transformFromAstSync(ast, undefined, {
				filename: path.resolve('./tempModule.js'),
				presets: [
					[
						'@babel/preset-typescript',
						{
							isTSX: true,
							allExtensions: true 
						}
					]
				]
			});

			return modifiedCode?.code ?? fileContent;
		}
	}
	return fileContent;
}

export function getOptions(minify: boolean): MinifyOptions {
	return {
		collapseWhitespace: minify,
		keepClosingSlash: minify,
		removeComments: minify,
		removeRedundantAttributes: minify,
		removeScriptTypeAttributes: minify,
		removeStyleLinkTypeAttributes: minify,
		useShortDoctype: minify,
		minifyCSS: minify
	};
}

export function findOrCreateMeta(root: HTMLElement, metaName: string, value: string, propertyName: string = 'name') {
	const head = root.querySelector('head');
	const querySelectorString = `meta[${propertyName}="${metaName}"]`;
	let metaDescription = root.querySelector(querySelectorString);
	if ( !metaDescription ) {
		head?.insertAdjacentHTML('beforeend', `<meta ${propertyName}="${metaName}" content="">`);
		metaDescription = root.querySelector(querySelectorString);
	}
	metaDescription?.setAttribute('content', value);
}

export function findOrCreateMetaProperty(root: HTMLElement, metaName: string, value: string) {
	findOrCreateMeta(root, metaName, value, 'property');
}

export function findOrCreateMetaItemProp(root: HTMLElement, metaName: string, value: string) {
	findOrCreateMeta(root, metaName, value, 'itemprop');
}
