import { readFile, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'esbuild';

const root = process.cwd();
const temporaryModule = resolve(root, 'scripts', '.prerender-app.mjs');
const bundled = await build({ entryPoints: [resolve(root, 'src', 'App.tsx')], bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic', write: false });
await writeFile(temporaryModule, bundled.outputFiles[0].text);

try {
  const { default: App } = await import(temporaryModule);
  for (const [file, route] of [
    ['index.html', '/'],
    ['start-a-project/index.html', '/start-a-project/'],
    ['book-a-call/index.html', '/book-a-call/'],
  ]) {
    const path = resolve(root, 'dist', file);
    const html = await readFile(path, 'utf8');
    const content = renderToString(createElement(App, { pathOverride: route }));
    await writeFile(path, html.replace('<div id="root"></div>', `<div id="root">${content}</div>`));
    console.log(`Prerendered ${route}`);
  }
} finally {
  await unlink(temporaryModule);
}
