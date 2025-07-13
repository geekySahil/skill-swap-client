import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Other plugins you might have
  ],
  resolve: {
    alias: {
      // Provide an absolute path to the polyfill
      'stream': path.resolve(__dirname, 'node_modules/rollup-plugin-node-polyfills/polyfills/stream.js'),
      // Add more polyfills if needed
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills()
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  }
});
