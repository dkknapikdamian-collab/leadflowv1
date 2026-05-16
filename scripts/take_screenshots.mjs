import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outDir = process.env.OUT_DIR || path.resolve("artifacts", "screenshots");

const pages = [
  { name: "today", url: `${baseUrl}/` },
  { name: "leads", url: `${baseUrl}/leads` },
  { name: "clients", url: `${baseUrl}/clients` },
  { name: "cases", url: `${baseUrl}/cases` },
];

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1536, height: 800 } });
const page = await context.newPage();

for (const entry of pages) {
  await page.goto(entry.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  const filePath = path.join(outDir, `${entry.name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(filePath);
}

await browser.close();
