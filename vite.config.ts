/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command }) => {
	return {
		define: {
			__DEV__: command === 'serve'
		},
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: './src/setupTests.ts',
			
			deps: {
				optimizer: {
					web: { 
						enabled: true,
						include: [
							'@resourge/history-store/utils'
						]
					}	
				}
			}
		},
		resolve: {
			preserveSymlinks: true
		},
		plugins: [
			react(),
			tsconfigPaths(),
			checker({
				typescript: true,
				enableBuild: true,
				overlay: {
					initialIsOpen: false
				},
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
				}
			})
		]
	};
});
