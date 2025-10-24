import type { ZudokuConfig } from "zudoku";
import { createApiIdentityPlugin } from "zudoku/plugins";

const backendUrl = import.meta.env.ZUDOKU_PUBLIC_BACKEND_URL || 'https://zudoku-backend.onrender.com';

const config: ZudokuConfig = {
  site: {
    title: "Documentation",
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
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "./openapi.yaml",
      path: "/api",
    },
  ],
  authentication: {
    type: "clerk",
    clerkPubKey:"pk_test_b3Blbi1ibHVlamF5LTMwLmNsZXJrLmFjY291bnRzLmRldiQ"
  },
  protectedRoutes: ["/*"],
  plugins: [
    createApiIdentityPlugin({
      getIdentities: async (context) => [
        {
          id: "clerk-auth",
          label: "Authenticated API Access",
          authorizeRequest: async (request) => {
            // Get the access token from Clerk authentication provider (await the Promise)
            const token = await context.authentication?.getAccessToken();
 
            if (token) {
              request.headers.set("Authorization", `Bearer ${token}`);
            } else {
            }

            return request;
          },
        },
      ],
    }),
  ]
};

export default config;
