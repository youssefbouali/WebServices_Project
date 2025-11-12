import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, Plugin } from "vite";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
	allowedHosts: ["eduapp.mywire.org", "localhost"],
    fs: {
      allow: [
<<<<<<< HEAD
        // Allow standard app sources
        path.resolve(__dirname, "./client"),
        path.resolve(__dirname, "./shared"),
        // Allow project root so Vite can serve index.html
        path.resolve(__dirname, "."),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
=======
        "./",
        "./client",
        "./shared",
        "../",         // autorise un niveau au-dessus si besoin
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
},
>>>>>>> dfeec91a9e548c60d7ab13b2ff01472fcfcb9bc5
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
