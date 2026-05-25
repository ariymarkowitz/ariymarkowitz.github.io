import katex from 'katex';
import 'katex/dist/katex.min.css';

export function renderLatex(text: string): string {
  // Display math: $$...$$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="math-error">$$${math}$$</span>`;
    }
  });
  // Inline math: $...$
  text = text.replace(/\$([^\n$]*?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="math-error">$${math}$</span>`;
    }
  });
  return text;
}
