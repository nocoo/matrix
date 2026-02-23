import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

function liveEndpointPlugin(): Plugin {
  return {
    name: "live-endpoint",
    configureServer(server) {
      server.middlewares.use("/api/live", (_req, res) => {
        const { version } = JSON.parse(
          readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
        );
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "ok", version }));
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
