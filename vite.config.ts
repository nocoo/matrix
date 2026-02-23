import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";
import { buildLiveResponse } from "./src/models/live";

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

function getVersion(): string {
  return JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8")).version;
}

function liveEndpointPlugin(): Plugin {
  return {
    name: "live-endpoint",
    configureServer(server) {
      server.middlewares.use("/api/live", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(buildLiveResponse(getVersion())));
      });
    },
  };
}

export default defineConfig(() => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    host: "::",
    port: 7019,
    allowedHosts: ["matrix.dev.hexly.ai"],
    hmr: {
      overlay: false,
    },
  },
  plugins: [tailwindcss(), react(), liveEndpointPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
