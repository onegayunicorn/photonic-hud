import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(process.cwd());
const servedDir = resolve(root, process.env.PHOTONIC_SERVE_DIR ?? "dist");
const manifestPath = resolve(servedDir, "artifact-manifest.json");

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function hashDirectory(directory) {
  const files = [];
  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (entry.name === "artifact-manifest.json") continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) files.push(full);
    }
  }
  walk(directory);

  const hash = createHash("sha256");
  for (const file of files.sort()) {
    const rel = relative(directory, file).split("\\").join("/");
    const bytes = readFileSync(file);
    hash.update(`${rel}\0${bytes.length}\0`);
    hash.update(bytes);
    hash.update("\0");
  }
  return { sha256: hash.digest("hex"), fileCount: files.length };
}

if (!existsSync(manifestPath)) {
  throw new Error(`Ω-02 FAIL: ${manifestPath} is missing`);
}
if (!existsSync(servedDir)) {
  throw new Error(`Ω-02 FAIL: ${servedDir} is missing`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const commitSha = git(["rev-parse", "HEAD"]);
const actual = hashDirectory(servedDir);

const checks = {
  schema: manifest.schema === "photonic-hud/artifact-identity/v1",
  sourceCommit: manifest.source?.commitSha === commitSha,
  servedPath: manifest.servedArtifact?.path === (process.env.PHOTONIC_SERVE_DIR ?? "dist"),
  contentHash: manifest.servedArtifact?.sha256 === actual.sha256,
  fileCount: manifest.servedArtifact?.fileCount === actual.fileCount,
};

for (const [name, passed] of Object.entries(checks)) {
  console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
}

if (!Object.values(checks).every(Boolean)) {
  throw new Error("Ω-02 FAIL: artifact identity checks did not all pass");
}

console.log(`Ω-02 PASS: ${commitSha.slice(0, 7)} · ${actual.sha256}`);
