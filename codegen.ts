import { CodegenConfig } from "@graphql-codegen/cli";
import Config from "react-native-config";

const config: CodegenConfig = {
  schema: "https://api.safelyq.dev/query",
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["src/**/*.{ts,tsx,graphql}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
