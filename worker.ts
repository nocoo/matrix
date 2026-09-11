export interface AssetEnv {
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
	async fetch(request: Request, env: AssetEnv): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/api/live") {
			const asset = await env.ASSETS.fetch(request);
			return new Response(asset.body, {
				status: 200,
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Cache-Control": "no-store",
				},
			});
		}
		return env.ASSETS.fetch(request);
	},
};
