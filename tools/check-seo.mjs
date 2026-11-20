import { readFileSync, readdirSync } from "node:fs";

const files = readdirSync(".").filter((f) => f.endsWith(".html"));
const issues = [];
const titles = new Map();

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
  const description = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || "";
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || "";
  const robots = (html.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || "";

  if (title.length > 75) issues.push(`${file}: title ${title.length} символов`);
  if (description.length < 80) issues.push(`${file}: description ${description.length} символов`);
  if (description.length > 200) issues.push(`${file}: description ${description.length} символов`);
  if (h1s !== 1) issues.push(`${file}: H1 = ${h1s}`);
  if (!canonical.startsWith("https://adastra-code.github.io/potolki-pro/")) issues.push(`${file}: canonical`);
  if (titles.has(title)) issues.push(`${file}: повтор title с ${titles.get(title)}`);
  titles.set(title, file);

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      issues.push(`${file}: JSON-LD не парсится (${error.message.slice(0, 60)})`);
    }
  }
}

console.log(`Проверено страниц: ${files.length}`);
console.log(issues.length ? issues.join("\n") : "SEO-проверки пройдены");
