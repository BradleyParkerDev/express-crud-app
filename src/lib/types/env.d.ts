declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string; // Always string in `process.env`
		APP_NAME:string;
		NODE_ENV: "development" | "production";
		USE_NEON: string; // Boolean-like, needs conversion
		NEON_DATABASE_URL: string;
		LOCAL_DATABASE_URL: string;
		JWT_SECRET_KEY: string;
		AWS_BUCKET_NAME: string;
		AWS_BUCKET_REGION: string;
		AWS_ACCESS_KEY_ID: string;
		AWS_SECRET_ACCESS_KEY: string;
	}
}
