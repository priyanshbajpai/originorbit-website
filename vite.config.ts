import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        project: new URL('./start-a-project/index.html', import.meta.url).pathname,
        booking: new URL('./book-a-call/index.html', import.meta.url).pathname,
      },
    },
  },
});
