import { marked } from 'marked';
import { renderLatex } from './latex';

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

export function getProjectDetailsHtml(slug: string): string | null {
  const raw = detailsBySlug[slug];
  if (raw === undefined) return null;
  const html = marked.parse(raw, { async: false }) as string;
  return renderLatex(html);
}
