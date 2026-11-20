import { readFileSync, readdirSync } from "node:fs";

const files = readdirSync(".").filter((f) => f.endsWith(".html"));
const bad = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");

  for (const word of ["undefined", "NaN", "{{", "вЂ", "Рџ", "localhost:4321"]) {
    if (html.includes(word)) bad.push(`${file}: содержит ${word}`);
  }

  if ((html.match(/<title>/g) || []).length !== 1) bad.push(`${file}: проблема с <title>`);
  if (!html.includes("</html>")) bad.push(`${file}: нет </html>`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) bad.push(`${file}: короткое описание`);
  if (!/<link rel="canonical"/.test(html)) bad.push(`${file}: нет canonical`);

  for (const match of html.matchAll(/<img\s[^>]*>/g)) {
    if (!/alt="[^"]+"/.test(match[0])) bad.push(`${file}: img без alt`);
  }

  for (const match of html.matchAll(/<a\s[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="noopener/.test(match[0])) bad.push(`${file}: target=_blank без noopener`);
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) bad.push(`${file}: дубли id ${dupes.join(", ")}`);
}

console.log(`Страниц: ${files.length}`);
console.log(bad.length ? bad.join("\n") : "Проблем не найдено");
