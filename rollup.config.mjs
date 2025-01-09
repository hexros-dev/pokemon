import userscript from 'rollup-plugin-userscript';
import tla from 'rollup-plugin-tla';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.user.js',
		format: 'iife',
	},
	plugins: [userscript(), tla()],
};
