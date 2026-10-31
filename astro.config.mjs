import {defineConfig} from 'astro/config';

export default defineConfig({
    site: 'https://txt.j4d.dev',
    output: 'static',
    outDir: './www',
    trailingSlash: 'always',
});
