import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next 16부터 flat config를 직접 제공한다 (FlatCompat 불필요)
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", ".next-build/**", "out/**", "node_modules/**"],
  },
];

export default eslintConfig;
