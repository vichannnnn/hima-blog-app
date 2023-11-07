import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default ({ mode }) => {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@api/auth': path.resolve(__dirname, 'src/api/auth/'),
        '@apiClient': path.resolve(__dirname, 'src/api/apiClient.ts'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@features': path.resolve(__dirname, 'src/features/'),
        '@providers': path.resolve(__dirname, 'src/providers/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
      },
    },
  });
};
