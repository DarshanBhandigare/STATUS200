import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localApiMiddleware() {
  return {
    name: 'local-api-functions',
    configureServer(server: { middlewares: { use: (handler: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next();
          return;
        }

        const route = req.url.slice('/api/'.length).split('?')[0];
        if (!['create-order', 'verify-payment', 'razorpay-webhook'].includes(route)) {
          next();
          return;
        }

        try {
          const bodyChunks: Buffer[] = [];
          for await (const chunk of req) bodyChunks.push(Buffer.from(chunk));
          const body = Buffer.concat(bodyChunks).toString('utf8');
          req.body = body ? JSON.parse(body) : undefined;

          res.status = (statusCode: number) => {
            res.statusCode = statusCode;
            return res;
          };
          res.json = (payload: unknown) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };

          const handlerModule = await import(pathToFileURL(path.resolve(__dirname, `api/${route}.js`)).href);
          const handler = handlerModule.default;
          await handler(req, res);
        } catch (error) {
          console.error(`Local API ${route} error:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Local API request failed' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      localApiMiddleware(),
      react(),
      tailwindcss(),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
