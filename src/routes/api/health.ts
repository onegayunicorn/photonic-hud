import { createFileRoute } from "@tanstack/react-router";
import { buildInfo } from "@/generated/build-info";

type ArtifactManifest = {
  schema: string;
  generatedAt: string;
  source: {
    commitSha: string;
    branch: string;
    buildId: string;
  };
  servedArtifact: {
    path: string;
    sha256: string;
    fileCount: number;
  };
  vercelOutput: {
    path: string;
    sha256: string;
    fileCount: number;
  } | null;
};

async function readArtifactManifest(request: Request): Promise<ArtifactManifest | null> {
  try {
    const url = new URL("/artifact-manifest.json", request.url);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const value = (await response.json()) as ArtifactManifest;
    if (value.schema !== "photonic-hud/artifact-identity/v1") return null;
    return value;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const manifest = await readArtifactManifest(request);
        const artifactIdentityPass =
          manifest !== null &&
          manifest.source.commitSha === buildInfo.commitSha &&
          manifest.source.buildId === buildInfo.buildId;

        return new Response(
          JSON.stringify(
            {
              status: artifactIdentityPass ? "operational" : "identity_unverified",
              artifact: {
                commitSha: buildInfo.commitSha,
                shortSha: buildInfo.shortSha,
                branch: buildInfo.branch,
                buildId: buildInfo.buildId,
                built: buildInfo.buildTime,
                contentSha256: manifest?.servedArtifact.sha256 ?? null,
                fileCount: manifest?.servedArtifact.fileCount ?? null,
                manifestAvailable: manifest !== null,
                identityPass: artifactIdentityPass,
              },
              deployment: {
                format: manifest?.vercelOutput ? "vercel-output" : "unknown",
                contentSha256: manifest?.vercelOutput?.sha256 ?? null,
                manifestAvailable: manifest?.vercelOutput !== null,
              },
              bridge: {
                mode: "simulation",
                evidenceLevel: "L2",
                l1Eligible: false,
              },
            },
            null,
            2,
          ) + "\n",
          {
            status: artifactIdentityPass ? 200 : 503,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store, max-age=0",
            },
          },
        );
      },
    },
  },
});
