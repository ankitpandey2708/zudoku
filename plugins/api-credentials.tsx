import { ZudokuPlugin } from "zudoku";

interface Credentials {
  backendUrl: string;
}

export const apiCredentials = (options: Credentials): ZudokuPlugin => {
  const { backendUrl } = options;

  return {
    getHead: () => {
      return (
        <script>
          {`
            (function() {
              const originalFetch = window.fetch;
              window.fetch = async function(...args) {
                const [resource, options = {}] = args;
                const url = typeof resource === 'string' ? resource : resource?.url;

                if (url?.includes('${backendUrl}')) {
                  // Try to get Clerk session token for cross-origin requests
                  let token = null;
                  try {
                    // Wait for Clerk to be available
                    if (window.Clerk) {
                      const session = await window.Clerk.session;
                      if (session) {
                        token = await session.getToken();
                      }
                    }
                  } catch (err) {
                    console.warn('Failed to get Clerk session token:', err);
                  }

                  const modifiedOptions = {
                    ...options,
                    credentials: 'include',
                    headers: {
                      ...options.headers,
                      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                    }
                  };

                  if (resource instanceof Request) {
                    args[0] = new Request(resource, modifiedOptions);
                  } else {
                    args[1] = modifiedOptions;
                  }
                }

                return originalFetch.apply(this, args);
              };
            })();
          `}
        </script>
      );
    },
  };
};
