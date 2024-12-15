import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // if port changed should change the frontend in the .env file in backend
    port: 3000,
  },
});
