/// <reference types="vitest" />

import react from '@vitejs/plugin-react-swc';

import { defineLibConfig } from './config/defineLibConfig';

// https://vitejs.dev/config/
export default defineLibConfig(
	() => ({
		plugins: [
			react()
		]
	})
);
