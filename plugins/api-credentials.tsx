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
              // Helper function to wait for Clerk to be available
              function waitForClerk(timeout = 5000) {
                return new Promise((resolve) => {
                  if (window.Clerk) {
                    console.log('[API Credentials] Clerk already available');
                    resolve(window.Clerk);
                    return;
                  }

                  console.log('[API Credentials] Waiting for Clerk to load...');
                  const startTime = Date.now();
                  const interval = setInterval(() => {
                    if (window.Clerk) {
                      console.log('[API Credentials] Clerk loaded after', Date.now() - startTime, 'ms');
                      clearInterval(interval);
                      resolve(window.Clerk);
                    } else if (Date.now() - startTime > timeout) {
                      console.warn('[API Credentials] Clerk not available after', timeout, 'ms timeout');
                      clearInterval(interval);
                      resolve(null);
                    }
                  }, 50);
                });
              }

              const originalFetch = window.fetch;
              window.fetch = async function(...args) {
                const [resource, options = {}] = args;
                const url = typeof resource === 'string' ? resource : resource?.url;

                if (url?.includes('${backendUrl}')) {
                  // Try to get Clerk session token for cross-origin requests
                  let token = null;
                  try {
                    // Wait for Clerk to be available (with 5 second timeout)
                    const clerk = await waitForClerk(5000);

                    if (clerk) {
                      console.log('[API Credentials] Getting session from Clerk...');
                      const session = await clerk.session;
                      if (session) {
                        console.log('[API Credentials] Session found, getting token...');
                        token = await session.getToken();
                        console.log('[API Credentials] Token obtained:', token ? 'YES' : 'NO');
                      } else {
                        console.warn('[API Credentials] No active Clerk session found');
                      }
                    } else {
                      console.warn('[API Credentials] Clerk not available on window object');
                    }
                  } catch (err) {
                    console.error('[API Credentials] Failed to get Clerk session token:', err);
                  }

                  const modifiedOptions = {
                    ...options,
                    credentials: 'include',
                    headers: {
                      ...options.headers,
                      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
                    }
                  };

                  console.log('[API Credentials] Making request to:', url);
                  console.log('[API Credentials] Authorization header present:', !!modifiedOptions.headers.Authorization);

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
