/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import path from 'path';
import { createMatchPath, loadConfig } from 'tsconfig-paths';
import type { CompilerOptions } from 'typescript';
import ts from 'typescript';
import { pathToFileURL } from 'url';

import { type DefaultViteReactRouterConfig } from './getDefaultViteConfig';
import { type ViteRouteMetadata, type InMemoryCode, type VitePathRouteMetadata } from './type';
import { replaceExtension } from './utils';

export const tsConfig = loadConfig();

function getDefaultValue<T extends (string | Record<string, string>) | (
	string[] | Record<string, string[]>
)>(
	config: DefaultViteReactRouterConfig, 
	value: T
): T extends (string | Record<string, string>) ? Record<string, string> : Record<string, string[]> {
	return (
		typeof value === 'string' || Array.isArray(value)
			? {
				[config.defaultLanguage]: value
			}
			: value
	) as T extends (string | Record<string, string>) ? Record<string, string> : Record<string, string[]>;
}

export function convertPathRouteMetadataToRouteMetadata(
	config: DefaultViteReactRouterConfig,
	routeMetadata: VitePathRouteMetadata
): ViteRouteMetadata {
	const title = getDefaultValue(config, routeMetadata.title);
	const description = getDefaultValue(config, routeMetadata.description);
	const keywords = getDefaultValue(config, routeMetadata.keywords);
	const route = routeMetadata.route;
	const isPrivate = routeMetadata.isPrivate;

	return {
		title,
		description,
		keywords,
		route,
		isPrivate
	};
}

export function getRouteMetadata(
	codes: InMemoryCode,
	cacheOutDir: string,
	options: CompilerOptions,
	config: DefaultViteReactRouterConfig
) {
	return new Promise<ViteRouteMetadata[]>((resolve, reject) => {
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
						fileNames.map(async (fileName) => {
							const newId = fileName.split('src');
							const newFileName = pathToFileURL(
								replaceExtension(
									path
									.join(
										cacheOutDir, 
										'src', 
										newId.at(-1) ?? ''
									),
									'.js'
								)
							).toString()
							.replace('.tsx', '.js');

							const module = await import(`${newFileName}?date=${new Date().toISOString()}`);

							const routeMetadata: VitePathRouteMetadata = module.default.routeMetadata;

							return convertPathRouteMetadataToRouteMetadata(
								config,
								routeMetadata
							);
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
		host.afterProgramCreate = (builderProgram) => {
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
