import { createHash } from "node:crypto";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { relative, resolve, dirname, basename, join } from "node:path";
import { readdirSync, statSync } from "node:fs";

const ROOT = process.cwd();
const SEARCH_ROOTS = [
  "docs/registry/icons/public/assets",
  "docs/assets",
  "docs",
];

const IMAGE_EXTENSIONS = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);

const duplicatePatterns = [
  /^(?<base>.+) (?<copy>[2-9]|[1-9][0-9]+)(?<ext>\.svg|\.png|\.jpg|\.jpeg|\.webp)$/i,
  /^(?<base>.+) copy(?<suffix>.*)(?<ext>\.svg|\.png|\.jpg|\.jpeg|\.webp)$/i,
  /^(?<base>.+)-copy(?<suffix>.*)(?<ext>\.svg|\.png|\.jpg|\.jpeg|\.webp)$/i,
  /^(?<base>.+)_copy(?<suffix>.*)(?<ext>\.svg|\.png|\.jpg|\.jpeg|\.webp)$/i,
];

const ignored = new Set([".git", "node_modules", "dist", "build"]);
const deleted = [];
const blocked = [];

function fileHash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function findCanonicalOriginal(path, base, ext) {
  const exactOriginal = resolve(dirname(path), `${base}${ext}`);
  if (existsSync(exactOriginal)) return exactOriginal;

  const lowerOriginal = resolve(dirname(path), `${base}${ext.toLowerCase()}`);
  if (existsSync(lowerOriginal)) return lowerOriginal;

  const target = `${base}${ext}`.toLowerCase();
  const sibling = readdirSync(dirname(path)).find((entry) => entry.toLowerCase() === target);
  return sibling ? resolve(dirname(path), sibling) : exactOriginal;
}

function walk(directory) {
  let entries = [];
  try {
    entries = readdirSync(directory);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (ignored.has(entry)) continue;

    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      walk(path);
      continue;
    }

    const match = duplicatePatterns
      .map((pattern) => basename(path).match(pattern))
      .find(Boolean);

    if (!match?.groups) continue;

    const ext = match.groups.ext.toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const original = findCanonicalOriginal(path, match.groups.base, match.groups.ext);

    if (!existsSync(original)) {
      blocked.push({
        duplicate: relative(ROOT, path),
        missingOriginal: relative(ROOT, original),
      });
      continue;
    }

    if (fileHash(path) !== fileHash(original)) {
      blocked.push({
        duplicate: relative(ROOT, path),
        conflictingOriginal: relative(ROOT, original),
      });
      continue;
    }

    unlinkSync(path);
    deleted.push(relative(ROOT, path));
  }
}

for (const root of SEARCH_ROOTS) {
  const absoluteRoot = resolve(ROOT, root);
  if (existsSync(absoluteRoot)) walk(absoluteRoot);
}

if (deleted.length) {
  console.log("Deleted duplicate icon artifacts:");
  for (const path of deleted) console.log(`- ${path}`);
} else {
  console.log("No duplicate icon artifacts required cleanup.");
}

if (blocked.length) {
  console.error("\nBlocked duplicate cleanup because canonical originals are missing or content differs:");
  for (const item of blocked) {
    if (item.missingOriginal) {
      console.error(`- ${item.duplicate} -> missing ${item.missingOriginal}`);
    } else {
      console.error(`- ${item.duplicate} -> differs from ${item.conflictingOriginal}`);
    }
  }
  process.exit(1);
}
