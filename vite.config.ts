import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        fastRefresh: true,
      })
    ],
    base: '/',
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') }
      ]
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'google-vendor': ['@react-oauth/google'],
            'chart-vendor': ['recharts']
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      open: true
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: true
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      'process.env': env
    }
  };
});