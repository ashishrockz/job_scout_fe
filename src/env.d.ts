/// <reference types="vite/client" />

interface ImportMetaEnv {
	// App
	VITE_APP_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}