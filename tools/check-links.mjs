import { readFileSync, readdirSync, existsSync } from "node:fs";

const files = readdirSync(".").filter((f) => f.endsWith(".html"));
const broken = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const re = /(?:href|src)="([^"#]+?)"/g;
  let match;
  while ((match = re.exec(html))) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const path = url.split("#")[0].split("?")[0];
    if (!path) continue;
    if (!existsSync(path)) broken.push(`${file} -> ${path}`);
  }
}

console.log(`Страниц: ${files.length}. Битых ссылок: ${broken.length}`);
if (broken.length) console.log(broken.join("\n"));
