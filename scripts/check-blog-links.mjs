import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const blogDir = join(root, 'src/content/blog');
const posts = await readdir(blogDir);
const knownTools = new Set((await readdir(join(root, 'src/pages/tools')))
  .filter((name) => name.endsWith('.astro') && !name.startsWith('['))
  .map((name) => `/tools/${name.replace('.astro', '')}`));
const knownPosts = new Set(posts.filter((name) => name.endsWith('.md')).map((name) => `/blog/${name.replace('.md', '')}`));
const broken = [];

for (const file of posts.filter((name) => name.endsWith('.md'))) {
  const content = await readFile(join(blogDir, file), 'utf8');
  for (const match of content.matchAll(/\]\((\/[^)#?]+)/g)) {
    const href = match[1];
    if (href.startsWith('/tools/') && !knownTools.has(href)) broken.push(`${file}: ${href}`);
    if (href.startsWith('/blog/') && !knownPosts.has(href)) broken.push(`${file}: ${href}`);
    if (href.startsWith('/images/')) {
      try { await stat(join(root, 'public', href)); } catch { broken.push(`${file}: ${href}`); }
    }
  }
}

if (broken.length) {
  console.error(`Broken blog links:\n${broken.join('\n')}`);
  process.exit(1);
}
console.log(`Verified internal links in ${knownPosts.size} blog posts.`);
