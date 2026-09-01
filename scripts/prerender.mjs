import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://cifrainst.ru';

const bundle = join(root, 'node_modules', '.cache', 'seo-content.cjs');
mkdirSync(dirname(bundle), { recursive: true });

await build({
  entryPoints: [join(root, 'src', 'data', 'seoContent.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: bundle,
  alias: { '@': join(root, 'src') },
  logLevel: 'silent',
});

const mod = await import(`file://${bundle}`);
const buildSeoHtml = mod.buildSeoHtml ?? mod.default?.buildSeoHtml ?? mod.default;
const seoHtml = buildSeoHtml();

const indexPath = join(dist, 'index.html');
if (!existsSync(indexPath)) {
  console.error('dist/index.html не найден — сначала выполните сборку');
  process.exit(1);
}

let html = readFileSync(indexPath, 'utf8');

const block = `<div id="root"><div id="seo-static" data-prerender="1">
${seoHtml}
</div></div>`;

html = html.replace('<div id="root"></div>', block);

const style = `<style>#seo-static{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}</style>`;
html = html.replace('</head>', `${style}\n</head>`);

writeFileSync(indexPath, html);

const routes = ['/', '/cabinet'];
const urls = routes
  .map((r) => `  <url><loc>${SITE}${r}</loc><changefreq>weekly</changefreq><priority>${r === '/' ? '1.0' : '0.6'}</priority></url>`)
  .join('\n');

writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
);

console.log(`Предрендер готов: ${(seoHtml.length / 1024).toFixed(1)} КБ текста в index.html`);
