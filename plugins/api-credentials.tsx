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
              window.fetch = function(...args) {
                const [resource, options = {}] = args;
                const url = typeof resource === 'string' ? resource : resource?.url;

                // Match both relative /api paths and the full backend URL
                if (url?.includes('/api/') || url?.includes('${backendUrl}')) {
                  if (resource instanceof Request) {
                    args[0] = new Request(resource, { ...options, credentials: 'include' });
                  } else {
                    args[1] = { ...options, credentials: 'include' };
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
