import del from 'rollup-plugin-delete';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import smartAsset from 'rollup-plugin-smart-asset';
import copy from 'rollup-plugin-copy';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const devMode = process.env.NODE_ENV !== 'production';

export default {
    input: 'src/index.js',
    output: {
        file: 'build/index.js',
        format: 'iife',
        assetFileNames: '[name].[hash][extname]',
        inlineDynamicImports: true,
    },
    plugins: [
        del({
            targets: 'build/*',
            runOnce: true,
        }),
        nodeResolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        babel({
            babelHelpers: 'bundled',
        }),
        commonjs(),
        styles({
            mode: 'extract',
        }),
        smartAsset({
            url: 'copy',
            nameFormat: '[name].[hash][ext]',
        }),
        copy({
            targets: [{ src: ['public/**/*', '!public/index.html'], dest: 'build' }],
        }),
        htmlTemplate({
            template: 'public/index.html',
            target: 'index.html',
            replaceVars: { '%PUBLIC_URL%': '.' },
        }),
    ].concat(
        devMode
            ? [
                serve({
                    contentBase: 'build',
                    open: true,
                    port: 3000,
                    historyApiFallback: true,
                }),
                livereload({
                    watch: 'build',
                }),
            ]
            : []
    ),
};