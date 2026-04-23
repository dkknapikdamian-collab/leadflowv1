import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

function resolveVendorChunk(id: string) {
  if (!id.includes('node_modules')) return undefined;
  if (id.includes('react-dom') || id.match(/[/\\]react[/\\]/) || id.includes('scheduler')) return 'vendor-react';
  if (id.includes('react-router')) return 'vendor-routing';
  if (id.includes('react-firebase-hooks')) return 'vendor-auth-hooks';
  if (id.includes('firebase/auth')) return 'vendor-firebase-auth';
  if (id.includes('firebase/firestore')) return 'vendor-firebase-firestore';
  if (id.includes('firebase/functions')) return 'vendor-firebase-functions';
  if (id.includes('firebase/storage')) return 'vendor-firebase-storage';
  if (id.includes('firebase/app')) return 'vendor-firebase-core';
  if (id.includes('firebase')) return 'vendor-firebase-misc';
  if (id.includes('@radix-ui')) return 'vendor-radix';
  if (id.includes('date-fns')) return 'vendor-date';
  if (id.includes('lucide-react')) return 'vendor-icons';
  if (id.includes('sonner')) return 'vendor-feedback';
  return undefined;
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            return resolveVendorChunk(id);
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
