import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * dev(turbopack)와 build(webpack)가 같은 `.next`를 쓰면 산출물이 섞여
   * app-build-manifest.json ENOENT가 난다. 검증용 빌드는
   * `NEXT_DIST_DIR=.next-build npm run build`로 분리해서 돌린다.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
