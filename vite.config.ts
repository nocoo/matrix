import { readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vite";

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

function liveEndpointPlugin(): Plugin {
	const metadata = () => {
		const { version } = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));
		return JSON.stringify({ status: "ok", name: "matrix", version });
	};

	return {
		name: "live-endpoint",
		configureServer(server) {
			server.middlewares.use("/api/live", (_req, res) => {
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.setHeader("Cache-Control", "no-store");
				res.end(metadata());
			});
		},
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "api/live",
				source: `${metadata()}\n`,
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
		port: 7013,
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
