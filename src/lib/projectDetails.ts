import { marked, Renderer } from 'marked';
import { renderLatex } from './latex';

const renderer = new Renderer();
renderer.link = function({ href, title, tokens }) {
  const content = this.parser.parseInline(tokens);
  return `<a href="${href}"${title ? ` title="${title}"` : ''} target="_blank" rel="noopener noreferrer">${content}</a>`;
};
marked.use({ renderer });

const modules = import.meta.glob('./project-details/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const detailsBySlug: Record<string, string> = {};
for (const [path, raw] of Object.entries(modules)) {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  detailsBySlug[slug] = raw;
}

export function hasProjectDetails(slug: string): boolean {
  return slug in detailsBySlug;
}

export async function getProjectDetailsHtml(slug: string): Promise<string | null> {
  const raw = detailsBySlug[slug];
  if (raw === undefined) return null;

  // Extract math before marked so it doesn't HTML-encode LaTeX special chars
  const stash: string[] = [];
  const escapemath = (src: string) =>
    src
      .replace(/\$\$([\s\S]*?)\$\$/g, (m) => { stash.push(m); return `\x00M${stash.length - 1}\x00`; })
      .replace(/\$([^\n$]*?)\$/g,     (m) => { stash.push(m); return `\x00M${stash.length - 1}\x00`; });

  const protected_ = escapemath(raw);
  let html = marked.parse(protected_, { async: false }) as string;
  html = html.replace(/\x00M(\d+)\x00/g, (_, i) => stash[+i]);
  return renderLatex(html);
}
