/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import path from 'path';
import { loadConfig, createMatchPath } from 'tsconfig-paths';
import type { CompilerOptions } from 'typescript';
import ts from 'typescript';

import { type InMemoryCode, type ViteReactRouterPathsType } from './type';
import { replaceExtension } from './utils';

export const tsConfig = loadConfig();

export function getRouteMetadata(
	codes: InMemoryCode,
	cacheOutDir: string,
	options: CompilerOptions
) {
	return new Promise<ViteReactRouterPathsType[]>((resolve, reject) => {
		const { outDir } = options;
		if ( tsConfig.resultType === 'failed' ) {
			reject(new Error());
			return;
		}

		const outDirPath = path.resolve(tsConfig.absoluteBaseUrl, outDir ?? '');
		const resolvePath = createMatchPath(
			outDirPath, 
			tsConfig.paths, 
			tsConfig.mainFields, 
			tsConfig.addMatchAll
		);

		const fileNames = Object.keys(codes);

		const host = ts.createWatchCompilerHost(
			fileNames,
			options,
			ts.sys,
			ts.createSemanticDiagnosticsBuilderProgram,
			undefined,
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			async (diagnostics) => {
				if (diagnostics.code !== 6031) {
					const routeMetadata = await Promise.all(
						fileNames.map((fileName) => {
							const newId = fileName.split('src');
							const newFileName = replaceExtension(
								path
								.join(
									cacheOutDir, 
									'src', 
									newId[newId.length - 1]
								),
								'.js'
							);

							return import(`file://${newFileName.replace('.tsx', '.js')}?date=${new Date().toISOString()}`)
							.then((module) => module.default.routeMetadata);
						})
					);

					close();

					resolve(routeMetadata);
				}
			},
			undefined,
			{
				watchFile: ts.WatchFileKind.PriorityPollingInterval
			}
		);

		const originalAfterProgramCreate = host.afterProgramCreate;
		const originalReadFile = host.readFile;

		host.readFile = (fileName) => {
			return codes[fileName] ? codes[fileName] : originalReadFile(fileName);
		};
		host.afterProgramCreate = builderProgram => {
			const originalEmit = builderProgram.emit;
			builderProgram.emit = (targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers): ts.EmitResult => {
				const transformers = customTransformers ?? {
					before: [] 
				};
				if (!transformers.before) transformers.before = [];
				transformers.before.push(
					(context) => {
						const { factory } = context;
						return (rootNode) => {
							return factory.updateSourceFile(
								rootNode,
								rootNode.statements.map((node: any) => {
									if (node.moduleSpecifier) {
										if (node.moduleSpecifier.text.includes('src')) {
											return factory.updateImportDeclaration(
												node,
												node.modifiers,
												node.importClause,
												factory.createStringLiteral(
													resolvePath(`${node.moduleSpecifier.text as string}.js`) ?? ''
												),
												node.assertClause
											);
										}
									}
									return node;
								})
							);
						};
					}
				);

				return originalEmit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, transformers);
			};
			if (originalAfterProgramCreate) originalAfterProgramCreate(builderProgram);
		};

		const { close } = ts.createWatchProgram(host);
	});
}
