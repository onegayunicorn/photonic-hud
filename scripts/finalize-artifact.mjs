import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(process.cwd());
const servedDir = resolve(root, process.env.PHOTONIC_SERVE_DIR ?? "dist");
const vercelDir = resolve(root, ".vercel/output");

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function hashDirectory(directory, { excludeNames = new Set() } = {}) {
  if (!existsSync(directory)) return null;

  const files = [];
  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (excludeNames.has(entry.name)) continue;
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
  return {
    sha256: hash.digest("hex"),
    fileCount: files.length,
  };
}

if (!existsSync(servedDir)) {
  throw new Error(
    `Ω-02 FAIL: served artifact directory does not exist: ${servedDir}. ` +
      `Build must produce ${process.env.PHOTONIC_SERVE_DIR ?? "dist"} before finalization.`,
  );
}

const commitSha = git(["rev-parse", "HEAD"]);
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
const buildInfoPath = resolve(root, "src/generated/build-info.ts");
const buildInfoText = existsSync(buildInfoPath) ? readFileSync(buildInfoPath, "utf8") : "";
const buildIdMatch = buildInfoText.match(/buildId:\s*"([^"]+)"/);
const buildId = buildIdMatch?.[1] ?? "unknown";

const manifest = {
  schema: "photonic-hud/artifact-identity/v1",
  generatedAt: new Date().toISOString(),
  source: {
    commitSha,
    branch,
    buildId,
  },
  hashing: {
    algorithm: "sha256",
    method: "sorted-relative-path-and-byte-content",
    excludedFromHashes: ["artifact-manifest.json"],
  },
  servedArtifact: {
    path: relative(root, servedDir).split("\\").join("/"),
    ...hashDirectory(servedDir, { excludeNames: new Set(["artifact-manifest.json"]) }),
  },
  vercelOutput: existsSync(vercelDir)
    ? {
        path: ".vercel/output",
        ...hashDirectory(vercelDir, { excludeNames: new Set(["artifact-manifest.json"]) }),
      }
    : null,
};

const json = JSON.stringify(manifest, null, 2) + "\n";
writeFileSync(resolve(root, "artifact-manifest.json"), json, "utf8");
writeFileSync(resolve(servedDir, "artifact-manifest.json"), json, "utf8");

const vercelStatic = resolve(vercelDir, "static");
if (existsSync(vercelStatic) && lstatSync(vercelStatic).isDirectory()) {
  writeFileSync(resolve(vercelStatic, "artifact-manifest.json"), json, "utf8");
}

console.log(
  `Ω-02 artifact identity: ${manifest.servedArtifact.sha256} ` +
    `(${manifest.servedArtifact.fileCount} files) · commit ${commitSha.slice(0, 7)}`,
);
