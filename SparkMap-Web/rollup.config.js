import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev', '--host', '0.0.0.0'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: !production
			}
		}),
		css({ output: 'bundle.css' }),

		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),

		replace({
			preventAssignment: true,
			values: {
				'process.env.ITINERARY_KEY': JSON.stringify(process.env.ITINERARY_KEY || ''),
				'process.env.GRAPHQL_CLIENT_KEY': JSON.stringify(process.env.GRAPHQL_CLIENT_KEY || ''),
				'process.env.GRAPHQL_APP_KEY': JSON.stringify(process.env.GRAPHQL_APP_KEY || '')
			}
		}),

		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};