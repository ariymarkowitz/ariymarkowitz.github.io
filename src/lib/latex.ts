import type katexType from 'katex';

let katex: typeof katexType | null = null;

async function load(): Promise<typeof katexType> {
  if (!katex) {
    katex = (await import('./latex-core')).default;
  }
  return katex;
}

export async function renderLatex(text: string): Promise<string> {
  const k = await load();
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return k.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="math-error">$$${math}$$</span>`;
    }
  });
  text = text.replace(/\$([^\n$]*?)\$/g, (_, math) => {
    try {
      return k.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="math-error">$${math}$</span>`;
    }
  });
  return text;
}
