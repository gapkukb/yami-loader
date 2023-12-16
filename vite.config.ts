import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
	if (command === "serve") {
		return {};
	}
	return {
		build: {
			target: "es2015",
			lib: {
				entry: "./src/index.ts",
				name: "yamiLoader",
				formats: ["es", "iife", "umd", "amd"] as any,
				fileName: (formatName) => `index.${formatName}.js`,
			},
		},
	};
});
