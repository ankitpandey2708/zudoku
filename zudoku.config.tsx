import type { ZudokuConfig } from "zudoku";
import { apiCredentials } from "./plugins/api-credentials";

const config: ZudokuConfig = {
  site: {
    title: "Finarkein Documentation",
    logo: {
      src: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
      alt: "Zudoku",
      width: "130px",
    },
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [
            "/introduction",
            {
              type: "link",
              icon: "folder-cog",
              badge: {
                label: "New",
                color: "purple",
              },
              label: "API Reference",
              to: "/api",
            },
          ],
        },
        {
          type: "category",
          label: "Useful Links",
          collapsible: false,
          icon: "link",
          items: [
            {
              type: "link",
              icon: "book",
              label: "Zudoku Docs",
              to: "https://zudoku.dev/docs/",
            },
          ],
        },
      ],
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
    },
  ],
  redirects: [],
  apis: [
    {
      type: "file",
      input: "./openapi.yaml",
      path: "/api",
    },
  ],
  authentication: {
    type: "clerk",
    clerkPubKey: "pk_live_dGlkeS1yYWNlci0xNy5jbGVyay5hY2NvdW50cy5kZXYk" as const
  },
  protectedRoutes: ["/*"],
  plugins: [
    apiCredentials({
      backendUrl: "https://zudoku-backend.onrender.com"
    })
  ]
};

export default config;
