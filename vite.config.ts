/// <reference types="vitest" />

import react from '@vitejs/plugin-react';

import { defineLibConfig } from './config/defineLibConfig';

// https://vitejs.dev/config/
export default defineLibConfig(
	() => ({
		plugins: [
			react()
		]
	}),
	() => {
		/* const indexDFilepath = './dist/index.d.ts';
		const content = fs.readFileSync(indexDFilepath, 'utf-8');
		const globalEventsContent = fs.readFileSync('./src/lib/GlobalEvents.ts', 'utf-8');

		fs.writeFileSync(indexDFilepath, `${content}${globalEventsContent}`, 'utf-8'); */
	}
);
