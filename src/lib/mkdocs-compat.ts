// Rewrites the MkDocs Material syntax the existing pages use into the
// directive syntax the rest of the pipeline understands, so old pages render
// unchanged and new pages can use either style.
//
//   !!! note "Title"      ->  :::note[Title]
//   ??? tip / ???+ tip    ->  :::details{type=tip} / {type=tip open}
//   === "Tab label"       ->  ::::tabs  :::tab[Tab label]
//
// MkDocs blocks are defined by 4-space indentation, which CommonMark would
// otherwise read as code, so this has to happen on the raw text.

// MkDocs tolerates an unclosed or missing quote around the title, and pages rely on that.
const ADMONITION = /^(\s*)(!!!|\?\?\?\+?)\s+([\w-]+)(?:\s+"?([^"]*?)"?)?\s*$/;
const TAB = /^(\s*)===\+?\s+"([^"]*)"\s*$/;
const ICON_SHORTCODE = /:(?:octicons|material|fontawesome|simple)-[\w-]+:\s?/g;

type Block = { start: number; end: number; indent: string; body: string[] };

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

function collectBody(lines: string[], from: number, indent: number): { body: string[]; end: number } {
  const body: string[] = [];
  let i = from;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || indentOf(line) >= indent + 4) {
      body.push(line.trim() === '' ? '' : line.slice(indent + 4));
      i++;
    } else break;
  }
  while (body.length && body[body.length - 1] === '') {
    body.pop();
    i--;
  }
  return { body, end: i };
}

function longestFence(text: string): number {
  let max = 2;
  for (const match of text.matchAll(/^\s*(:{3,})/gm)) max = Math.max(max, match[1].length);
  return max;
}

function fence(n: number): string {
  return ':'.repeat(n);
}

function reindent(text: string, indent: string): string {
  return text
    .split('\n')
    .map((line) => (line === '' ? '' : indent + line))
    .join('\n');
}

export function mkdocsCompat(source: string): string {
  const lines = source.replace(ICON_SHORTCODE, '').split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const admonition = line.match(ADMONITION);
    const tab = line.match(TAB);

    if (admonition) {
      const [, indent, marker, type, title] = admonition;
      const { body, end } = collectBody(lines, i + 1, indent.length);
      const inner = mkdocsCompat(body.join('\n'));
      const f = fence(longestFence(inner) + 1);
      const label = title !== undefined ? `[${title}]` : '';
      const open =
        marker === '!!!'
          ? `${f}${type}${label}`
          : `${f}details${label}{type=${type}${marker === '???+' ? ' open' : ''}}`;
      out.push(reindent([open, inner, f].join('\n'), indent));
      i = end;
      continue;
    }

    if (tab) {
      const indent = tab[1];
      const tabs: Block[] = [];
      let j = i;
      while (j < lines.length) {
        const m = lines[j].match(TAB);
        if (!m || m[1] !== indent) break;
        const { body, end } = collectBody(lines, j + 1, indent.length);
        tabs.push({ start: j, end, indent, body: [m[2], ...body] });
        j = end;
        while (j < lines.length && lines[j].trim() === '') j++;
      }
      const rendered = tabs.map(({ body: [label, ...body] }) => ({ label, inner: mkdocsCompat(body.join('\n')) }));
      const f = fence(Math.max(...rendered.map((t) => longestFence(t.inner))) + 1);
      const outer = fence(f.length + 1);
      const parts = [`${outer}tabs`];
      for (const t of rendered) parts.push(`${f}tab[${t.label.replace(/`/g, '')}]`, t.inner, f);
      parts.push(outer);
      out.push(reindent(parts.join('\n'), indent), '');
      i = j;
      continue;
    }

    out.push(line);
    i++;
  }

  return out.join('\n');
}
