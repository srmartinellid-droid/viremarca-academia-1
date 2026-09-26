export const dynamic = "force-static";

export function GET() {
  return Response.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "local",
    environment: process.env.VERCEL_ENV ?? "development",
    builtAt: new Date().toISOString(),
  });
}
